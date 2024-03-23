// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {FundMe} from "../../src/FundMe.sol";
import {MockV3Aggregator} from "../mocks/MockV3Aggretator.sol";
import {Test, Vm} from "forge-std/Test.sol";

contract FundMeTest is Test {
    FundMe private fundMe;
    MockV3Aggregator private priceFeed;

    address private constant OWNER = address(42);
    address private constant USER = address(777);
    address private constant USER2 = address(333);
    uint8 private constant DECIMALS = 8;
    int256 private constant INITIAL_ANSWER = 2000e8;
    uint256 private constant INITIAL_BALANCE = 10 ether;

    event Withdraw(uint256 indexed amount);

    function setUp() external {
        priceFeed = new MockV3Aggregator(DECIMALS, INITIAL_ANSWER);

        vm.prank(OWNER, OWNER);
        fundMe = new FundMe(address(priceFeed));

        vm.deal(OWNER, INITIAL_BALANCE);
        vm.deal(USER, INITIAL_BALANCE);
        vm.deal(USER2, INITIAL_BALANCE);
    }

    function testFundMe__GetPriceFeedVersion() public {
        uint256 priceFeedVersion = fundMe.getVersion();
        assertEq(priceFeedVersion, 4, "Unexpected price feed version");
    }

    function testFundMe__GetContractOwner() public view {
        address owner = fundMe.getOwner();
        assertEq(owner, OWNER, "Unexpected contract owner");
    }

    function testFundMe__GetPriceFeed() public {
        address _priceFeed = address(fundMe.getPriceFeed());
        assertEq(_priceFeed, address(priceFeed), "Unexpected price feed address");
    }

    function testFundMe__FundersSendDonationDirectly() public {
        vm.prank(USER, USER);
        (bool sent1,) = address(fundMe).call{value: 0.0025 ether}("");
        assertTrue(sent1);
        assertEq(address(fundMe).balance, 0.0025 ether, "Unexpected contract balance");

        vm.prank(USER2, USER2);
        (bool sent2,) = address(fundMe).call{value: 0.0025 ether}("");
        assertTrue(sent2);
        assertEq(address(fundMe).balance, 0.005 ether, "Unexpected contract balance");
    }

    function testFundMe__FunderCannotSendThanMinimumDonation() public {
        vm.expectRevert(_encodeError("FundMe__DonationTooSmall()"));
        vm.prank(USER, USER);
        fundMe.fund{value: 0.0024 ether}();

        vm.expectRevert(_encodeError("FundMe__DonationTooSmall()"));
        vm.prank(USER2, USER2);
        fundMe.fund{value: 0.0024 ether}();

        assertEq(address(fundMe).balance, 0, "Unexpected contract balance");
        assertEq(USER.balance, INITIAL_BALANCE, "Unexpected USER balance");
        assertEq(USER2.balance, INITIAL_BALANCE, "Unexpected USER2 balance");
    }

    function testFundMe__FundersSendDonations() public {
        vm.prank(USER, USER);
        fundMe.fund{value: 0.0025 ether}();

        vm.prank(USER, USER);
        fundMe.fund{value: 0.0025 ether}();

        vm.prank(USER2, USER2);
        fundMe.fund{value: 0.0025 ether}();

        vm.prank(USER2, USER2);
        fundMe.fund{value: 0.0025 ether}();

        assertEq(address(fundMe).balance, 0.01 ether, "Unexpected contract balance");
        assertEq(USER.balance, INITIAL_BALANCE - 0.005 ether, "Unexpected USER balance");
        assertEq(USER2.balance, INITIAL_BALANCE - 0.005 ether, "Unexpected USER2 balance");
    }

    modifier funded() {
        vm.recordLogs();

        vm.prank(USER, USER);
        fundMe.fund{value: 0.0025 ether}();

        vm.prank(USER2, USER2);
        fundMe.fund{value: 0.0025 ether}();
        _;
    }

    function testFundMe__EventsAreEmittedOnDonations() public funded {
        Vm.Log[] memory logs = vm.getRecordedLogs();

        assertEq(logs.length, 2, "Unexpected number of logs");

        for (uint256 i; i < logs.length; i++) {
            Vm.Log memory log = logs[i];

            assertEq(log.topics[0], keccak256("Fund(address,uint256)"), "Unexpected event signature");
            uint256 amountFunded = abi.decode(log.data, (uint256));
            assertEq(amountFunded, 0.0025 ether, "Unexpected amount funded");

            // the first event is emitted on USER donation
            if (i == 0) assertEq(log.topics[1], bytes32(uint256(uint160(USER))), "Unexpected funder address");
            // the second event is emitted on USER2 donation
            else if (i == 1) assertEq(log.topics[1], bytes32(uint256(uint160(USER2))), "Unexpected funder address");
        }
    }

    function testFundMe__GetDonationByFunder() public funded {
        uint256 userDonation = fundMe.getAddressToAmountFunded(USER);
        assertEq(userDonation, 0.0025 ether, "Unexpected USER balance");

        uint256 user2Donation = fundMe.getAddressToAmountFunded(USER2);
        assertEq(user2Donation, 0.0025 ether, "Unexpected USER2 balance");
    }

    function testFundMe__OnlyTheOwnerCanWithdrawDonations() public funded {
        vm.expectRevert(_encodeError("FundMe__NotOwner()"));
        vm.prank(USER, USER);
        fundMe.withdraw();

        vm.expectRevert(_encodeError("FundMe__NotOwner()"));
        vm.prank(USER2, USER2);
        fundMe.withdraw();
    }

    function testFundMe__OwnerWithdrawTheDonations() public funded {
        uint256 expectedAmountWithdrawn = 0.005 ether;
        uint256 initialOwnerBalance = OWNER.balance;
        uint256 initialContractBalance = address(fundMe).balance;

        vm.prank(OWNER, OWNER);
        fundMe.withdraw();

        uint256 endingOwnerBalance = OWNER.balance;
        uint256 endingContractBalance = address(fundMe).balance;

        assertEq(endingContractBalance, 0, "Unexpected contract balance");
        assertEq(expectedAmountWithdrawn, endingOwnerBalance - initialOwnerBalance, "Unexpected owner balance");
    }

    function testFundMe__EventIsEmittedOnWithdraw() public funded {
        vm.expectEmit(true, false, false, false, address(fundMe));
        emit Withdraw(0.005 ether);
        vm.prank(OWNER, OWNER);
        fundMe.withdraw();
    }

    function testFundMe__GetFunders() public funded {
        address funder0 = fundMe.getFunder(0);
        address funder1 = fundMe.getFunder(1);

        assertEq(funder0, USER, "Unexpected funder address");
        assertEq(funder1, USER2, "Unexpected funder address");
    }

    // ========================================= HELPERS ========================================= //

    function _encodeError(string memory errorMessage) private returns (bytes memory) {
        return abi.encodeWithSignature(errorMessage);
    }
}
