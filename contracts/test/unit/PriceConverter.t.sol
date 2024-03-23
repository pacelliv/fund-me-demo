// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {PriceConverter} from "../../src/PriceConverter.sol";
import {MockV3Aggregator} from "../mocks/MockV3Aggretator.sol";
import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import {Test} from "forge-std/Test.sol";

contract PriceConverterTest is Test {
    MockV3Aggregator private priceFeed;

    uint8 private constant DECIMALS = 8;
    int256 private constant INITIAL_ANSWER = 2000e8;

    function setUp() external {
        priceFeed = new MockV3Aggregator(DECIMALS, INITIAL_ANSWER);
    }

    function testPriceConverter__ReadThePrice() public {
        uint256 ethUsdPrice1 = PriceConverter.getPrice(AggregatorV3Interface(address(priceFeed)));
        assertEq(ethUsdPrice1, 2000e18, "Unexpected price");

        priceFeed.updateAnswer(1000e8);
        uint256 ethUsdPrice2 = PriceConverter.getPrice(AggregatorV3Interface(address(priceFeed)));
        assertEq(ethUsdPrice2, 1000e18, "Unexpected price");

        priceFeed.updateAnswer(3000e8);
        uint256 ethUsdPrice3 = PriceConverter.getPrice(AggregatorV3Interface(address(priceFeed)));
        assertEq(ethUsdPrice3, 3000e18, "Unexpected price");

        priceFeed.updateAnswer(4000e8);
        uint256 ethUsdPrice4 = PriceConverter.getPrice(AggregatorV3Interface(address(priceFeed)));
        assertEq(ethUsdPrice4, 4000e18, "Unexpected price");
    }

    function testPriceConverter__GetsTheConvertionRateCorrectly() public {
        uint256 ethAmountInUsd1 = PriceConverter.getConversionRate(1 ether, AggregatorV3Interface(address(priceFeed)));
        assertEq(ethAmountInUsd1, 2000e18, "Unexpected conversion rate");

        uint256 ethAmountInUsd2 = PriceConverter.getConversionRate(0.5 ether, AggregatorV3Interface(address(priceFeed)));
        assertEq(ethAmountInUsd2, 1000e18, "Unexpected conversion rate");

        uint256 ethAmountInUsd3 = PriceConverter.getConversionRate(2 ether, AggregatorV3Interface(address(priceFeed)));
        assertEq(ethAmountInUsd3, 4000e18, "Unexpected conversion rate");

        uint256 ethAmountInUsd4 = PriceConverter.getConversionRate(3 ether, AggregatorV3Interface(address(priceFeed)));
        assertEq(ethAmountInUsd4, 6000e18, "Unexpected conversion rate");

        uint256 ethAmountInUsd5 = PriceConverter.getConversionRate(4 ether, AggregatorV3Interface(address(priceFeed)));
        assertEq(ethAmountInUsd5, 8000e18, "Unexpected conversion rate");
    }
}
