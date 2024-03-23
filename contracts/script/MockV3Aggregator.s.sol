// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Script, console2} from "forge-std/Script.sol";
import {MockV3Aggregator} from "../test/mocks/MockV3Aggretator.sol";

string constant LINE_JUMP = "\n";

contract DeployMockAggregator is Script {
    int256 private constant INITIAL_ANSWER = 2000e8;
    uint8 private constant DECIMALS = 8;

    function run() public {
        vm.broadcast();
        new MockV3Aggregator(DECIMALS, INITIAL_ANSWER);
    }
}

contract UpdateAggregatorAnswer is Script {
    int256 private constant NEW_ANSWER = 2000e8;
    address mockPriceFeed = address(0);

    function run() public {
        vm.broadcast();
        MockV3Aggregator(mockPriceFeed).updateAnswer(NEW_ANSWER);

        int256 newAnswer = MockV3Aggregator(mockPriceFeed).latestAnswer();
        console2.log("New answer", uint256(newAnswer), LINE_JUMP);
    }
}
