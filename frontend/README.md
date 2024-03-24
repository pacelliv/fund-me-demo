# Storeth Frontend

## Quickstart

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
