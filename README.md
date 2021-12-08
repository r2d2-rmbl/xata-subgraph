# XATA Subgraph

[XATA](https://xata.fi/) is a decentralized protocol for automated token exchange with built-in MEV protection and gasless transactions.

This subgraph dynamically tracks any pair created by the xata factory. It tracks of the current state of XATA contracts, and contains derived stats for things like historical data and USD prices.

- aggregated data across pairs and tokens,
- data on individual pairs and tokens,
- data on transactions
- data on liquidity providers
- historical data on Xata, pairs or tokens, aggregated by day

## Running Locally

Make sure to update package.json settings to point to your own graph account.

## Queries

Below are a few ways to show how to query the xata-subgraph for data. The queries show most of the information that is queryable, but there are many other filtering options that can be used, just check out the [querying api](https://thegraph.com/docs/graphql-api). These queries can be used locally or in The Graph Explorer playground.

## Key Entity Overviews

#### ConveyorV2Factory

Contains data across all of XATA. This entity tracks important things like total liquidity (in ETH and USD, see below), all time volume, transaction count, number of pairs and more.

#### Token

Contains data on a specific token. This token specific data is aggregated across all pairs, and is updated whenever there is a transaction involving that token.

#### ConveyorV2Pair

Contains data on a specific pair.

#### Transaction

Every transaction on XATA is stored. Each transaction contains an array of mints, burns, and swaps that occured within it.
This includes information about meta-trasnactions as well, including gas tokens paid.

#### Mint, Burn, Swap

These contain specifc information about a transaction. Things like which pair triggered the transaction, amounts, sender, recipient, and more. Each is linked to a parent Transaction entity.

## Example Queries

### Querying XATA Data

This query fetches the first 10 swaps.

```graphql
{
  swaps(first:10) {
    id
    pair {
      token0 {
        id
        symbol
        decimals
      }
    }
    amount0In
    amount0Out
    to
  }
}
```

## Network specific parameters
1. subgraph.yaml:
   * dataSources.network
   * dataSources.source.address
   * templates.network
2. package.json:
   * script for 'deploy' - the subgraph name will be different
3. src/mappings/pricing.ts
   * Ensure that the whitelisted token addresses match the target network (`WHITELIST`)
4. src/mappings/helpers.ts
   * FACTORY_ADDRESS, if they are different across the networks
5. src/mappings/routers.ts
   * ROUTER_ADDRESS, if they are different across the networks

## Deployment
1. Install dependencies 

    `yarn install`

2. Generate the type files for the scripts in `src` by running

    `yarn codegen`

3. Ensure that network parameters are correct by referring to previous section
4. Deploy using

    `yarn deploy`
