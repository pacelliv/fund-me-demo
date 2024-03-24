# FundMe Contracts

## Quickstart

Create a keystore

```bash
# 1 encrypt private key:
cast wallet import test_wallet --interactive

# 2. insert private key
# 3. set password
```

Create a `.env` file with the following format:

```bash
SENDER=0x123456789abcdef... # address associated with the encrypted private key in keystore
ARBITRUM_SEPOLIA_RPC_URL=https://arb-sepolia.g.alchemy.com/v2/your-api-key
ARBISCAN_API_KEY=GWRGWGW121142...
```

You can get your keys in:

- [Alchemy](https://www.alchemy.com/)
- [Arbiscan](https://arbiscan.io/)

### Build

```bash
make build
```

### Run tests

```bash
make test
```

### Format

```bash
make format
```

### Project commands

#### Deploy contract (FundMe)

```bash
make deploy_funding ARGS="-d --network arbitrumSepolia"
```

Grab the address of the deployed contract and store it in `script/FundMe.s.sol` line 8.

#### Fund the contract

```bash
make fund ARGS="-i --network arbitrumSepolia"
```

### Withdraw the funds

```bash
make withdraw ARGS="-i --network arbitrumSepolia"
```

### For more commands check Makefile file
