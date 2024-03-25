// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import {PriceConverter} from "./PriceConverter.sol";

/**
 * @title A sample Funding Contract
 * @author pacelliv (https://wwww.x.com/pacelliv3)
 * @notice This contract is for creating a sample funding contract
 * @dev This contract implements the Chainlink ETH/USD price feed as our pricing library
 */
contract FundMe {
    // Type Declarations
    using PriceConverter for uint256;

    // State variables
    uint256 private constant MINIMUM_USD = 5 * 10 ** 18;
    address private immutable i_owner;
    address[] private s_funders;
    mapping(address => uint256) private s_addressToAmountFunded;
    AggregatorV3Interface private immutable s_priceFeed;

    // events
    event Fund(address indexed sender, uint256 amount);
    event Withdraw(uint256 indexed amount);

    // custom errorr
    error FundMe__NotOwner();
    error FundMe__DonationTooSmall();
    error FundMe__NothingToWithdraw();
    error FundMe__WithdrawFailed();

    modifier onlyOwner() {
        if (msg.sender != i_owner) revert FundMe__NotOwner();
        _;
    }

    constructor(address priceFeed) {
        s_priceFeed = AggregatorV3Interface(priceFeed);
        i_owner = msg.sender;
    }

    receive() external payable {
        fund();
    }

    /**
     * @notice Funds our contract based on the ETH/USD price
     */
    function fund() public payable {
        if (msg.value.getConversionRate(s_priceFeed) < MINIMUM_USD) revert FundMe__DonationTooSmall();
        s_addressToAmountFunded[msg.sender] += msg.value;
        s_funders.push(msg.sender);
        emit Fund(msg.sender, msg.value);
    }

    /**
     * @notice Withdraws the current ether balance from the contract
     */
    function withdraw() external onlyOwner {
        if (address(this).balance == 0) revert FundMe__NothingToWithdraw();
        uint256 amountToWithdraw = address(this).balance;
        address[] memory funders = s_funders;

        for (uint256 funderIndex = 0; funderIndex < funders.length; funderIndex++) {
            address funder = funders[funderIndex];
            s_addressToAmountFunded[funder] = 0;
        }
        s_funders = new address[](0);

        emit Withdraw(amountToWithdraw);
        (bool success,) = i_owner.call{value: address(this).balance}("");
        if (!success) revert FundMe__WithdrawFailed();
    }

    /**
     * Getter Functions
     */

    /**
     * @notice Gets the amount that an address has funded
     *  @param fundingAddress the address of the funder
     *  @return the amount funded
     */
    function getAddressToAmountFunded(address fundingAddress) external view returns (uint256) {
        return s_addressToAmountFunded[fundingAddress];
    }

    /**
     * @notice Reads the price feed version
     */
    function getVersion() external view returns (uint256) {
        return s_priceFeed.version();
    }

    /**
     * @notice Reads the funder at a given index
     * @param index Index of the funder
     */
    function getFunder(uint256 index) external view returns (address) {
        return s_funders[index];
    }

    /**
     * @notice Reads the owner of the contract
     */
    function getOwner() external view returns (address) {
        return i_owner;
    }

    /**
     * @notice Reads the address of the ETH/USD price feed
     */
    function getPriceFeed() external view returns (AggregatorV3Interface) {
        return s_priceFeed;
    }
}
