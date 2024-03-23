// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Script, console2} from "forge-std/Script.sol";
import {FundMe} from "../src/FundMe.sol";

string constant LINE_JUMP = "\n";
address payable constant FUND_ME = payable(address(0));
address constant ARBITRUM_SEPOLIA_ETH_USD_PRICE_FEED = 0xd30e2101a97dcbAeBCBC04F14C3f624E67A35165;

contract DeployFundMe is Script {
    address private PRICE_FEED = block.chainid == 421614 ? ARBITRUM_SEPOLIA_ETH_USD_PRICE_FEED : address(0);

    function run() public {
        vm.broadcast();
        FundMe fundMe = new FundMe(PRICE_FEED);

        console2.log("FundMe contract deployed at", address(fundMe), LINE_JUMP);
    }
}

contract Fund is Script {
    uint256 private constant DONATION = 0.0039351276 ether;

    function run() public {
        address funder = msg.sender;

        vm.broadcast();
        FundMe(FUND_ME).fund{value: DONATION}();

        console2.log("Contract balance", FUND_ME.balance);
        console2.log("Donations by sender", FundMe(FUND_ME).getAddressToAmountFunded(funder), LINE_JUMP);
    }
}

contract Withdraw is Script {
    function run() public {
        uint256 amountToWithdraw = FUND_ME.balance;

        vm.broadcast();
        FundMe(FUND_ME).withdraw();

        console2.log("Contract balance", FUND_ME.balance);
        console2.log("Amount withdrawn", amountToWithdraw, LINE_JUMP);
    }
}
