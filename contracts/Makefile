-include .env

.PHONY: all help clean install build update format coverage snapshot test anvil

help:
	@echo ""
	@echo "	Usage:"
	@echo ""
	@echo "	Deploy mock aggregator:"
	@echo "	make deploy_mock_aggregator [ARGS=...]	example: make deploy_mock_aggregator ARGS=\"-d --network arbitrumSepolia"\"
	@echo ""
	@echo "	Update aggregator answer:"
	@echo "	make update_answer [ARGS=...]		example: make update_answer ARGS=\"-i --network arbitrumSepolia"\"
	@echo ""
	@echo "	Deploy funding contract:"
	@echo "	make deploy_funding [ARGS=...]		example: make deploy_funding ARGS=\"-d --network arbitrumSepolia"\"
	@echo ""
	@echo "	Fund contract:"
	@echo "	make fund [ARGS=...]			example: make fund ARGS=\"-i --network arbitrumSepolia"\"
	@echo ""
	@echo "	Withdraw funds:"
	@echo "	make withdraw [ARGS=...]		example: make withdraw ARGS=\"-i --network arbitrumSepolia"\"

all:; clean remove install build update

clean :; forge clean

remove :; rm .gitmodules && rm -rf .git/modules/* lib && touch .gitmodules && git add . && git commit -m "modules"

install :; forge install foundry-rs/forge-std --no-commit

build :; forge build

update :; forge update

format :; forge fmt

coverage :; forge coverage --report > coverage-report.txt

snapshot :; forge snapshot

test :; forge test

anvil :; anvil --block-time 12

RPC_URL := http://127.0.0.1:8545
DEFAULT_ANVIL_KEY := 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
NETWORK_ARGS := --rpc-url $(RPC_URL) --private-key $(DEFAULT_ANVIL_KEY) --broadcast -vvvv

ifeq ($(findstring -d --network arbitrumSepolia,$(ARGS)), -d --network arbitrumSepolia)
	NETWORK_ARGS := --account test_wallet --sender $(SENDER) --rpc-url $(ARBITRUM_SEPOLIA_RPC_URL) --broadcast -vvvv --verify --etherscan-api-key $(ARBISCAN_API_KEY)
endif

ifeq ($(findstring -i --network arbitrumSepolia,$(ARGS)), -i --network arbitrumSepolia)
	NETWORK_ARGS := --account test_wallet --sender $(SENDER) --rpc-url $(ARBITRUM_SEPOLIA_RPC_URL) --broadcast -vvvv
endif

deploy_mock_aggregator:
	@forge script script/MockV3Aggregator.s.sol:DeployMockAggregator $(NETWORK_ARGS)

update_answer:
	@forge script script/MockV3Aggregator.s.sol:UpdateAggregatorAnswer $(NETWORK_ARGS)

deploy_funding:
	@forge script script/FundMe.s.sol:DeployFundMe $(NETWORK_ARGS)

fund:
	@forge script script/FundMe.s.sol:Fund $(NETWORK_ARGS)

withdraw:
	@forge script script/FundMe.s.sol:Withdraw $(NETWORK_ARGS)