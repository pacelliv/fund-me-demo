# Storeth Frontend

## Quickstart

## The Graph

This project queries a Subgraph to get data from events emitted by the FundMe contract, to create a subgraph follow this [tutorial](https://thegraph.com/docs/en/deploying/subgraph-studio/), create the subgraph on Arbitrum Sepolia.

### Install the dependencies

```bash
yarn
```

Create a `.env.local` file with the following environment variables:

```bash
VITE_ARBITRUM_SEPOLIA_RPC_URL=https://arb-sepolia.g.alchemy.com/v2/your-api-key
VITE_WALLET_CONNECT_PROJECT_ID=your-project-id
```

### Start dev mode

```bash
yarn dev
```

### Build the project

```bash
yarn build && yarn start
```

### Format the project

```bash
yarn prettier:check
yarn prettier:fix
```
