import request, { gql } from 'graphql-request';
import { CHAIN_IDS } from './network';

const getWethPriceQuery = gql`
  {
    pair(id: "0x397ff1542f962076d0bfe58ea045ffa2d347aca0") {
      token0Price
    }
  }
`;

const EXCHANGE_ENDPOINTS: { [chainId: number]: string } = {
  [CHAIN_IDS.ARBITRUM]: 'https://api.thegraph.com/subgraphs/name/sushiswap/arbitrum-exchange',
  [CHAIN_IDS.AVALANCHE]: 'https://api.thegraph.com/subgraphs/name/sushiswap/avalanche-exchange',
  [CHAIN_IDS.BSC]: 'https://api.thegraph.com/subgraphs/name/sushiswap/bsc-exchange',
  [CHAIN_IDS.CELO]: 'https://api.thegraph.com/subgraphs/name/jiro-ono/sushitestsubgraph',
  [CHAIN_IDS.ETHEREUM]: 'https://api.thegraph.com/subgraphs/name/sushiswap/exchange',
  [CHAIN_IDS.FANTOM]: 'https://api.thegraph.com/subgraphs/name/sushiswap/fantom-exchange',
  [CHAIN_IDS.HARMONY]: 'https://sushi.graph.t.hmny.io/subgraphs/name/sushiswap/harmony-exchange',
  [CHAIN_IDS.MOONRIVER]: 'https://api.thegraph.com/subgraphs/name/sushiswap/moonriver-exchange',
  [CHAIN_IDS.POLYGON]: 'https://api.thegraph.com/subgraphs/name/jiro-ono/matic-exchange-staging',
  [CHAIN_IDS.XDAI]: 'https://api.thegraph.com/subgraphs/name/sushiswap/xdai-exchange',
};

const FACTORY_ADDRESSES: { [chainId: number]: string } = {
  [CHAIN_IDS.ARBITRUM]: '0xc35DADB65012eC5796536bD9864eD8773aBc74C4',
  [CHAIN_IDS.AVALANCHE]: '0xc35DADB65012eC5796536bD9864eD8773aBc74C4',
  [CHAIN_IDS.BSC]: '0xc35DADB65012eC5796536bD9864eD8773aBc74C4',
  [CHAIN_IDS.CELO]: '0xc35DADB65012eC5796536bD9864eD8773aBc74C4',
  [CHAIN_IDS.ETHEREUM]: '0xC0AEe478e3658e2610c5F7A4A2E1777cE9e4f2Ac',
  [CHAIN_IDS.FANTOM]: '0xc35DADB65012eC5796536bD9864eD8773aBc74C4',
  [CHAIN_IDS.HARMONY]: '0xc35DADB65012eC5796536bD9864eD8773aBc74C4',
  [CHAIN_IDS.MOONRIVER]: '0xc35DADB65012eC5796536bD9864eD8773aBc74C4',
  [CHAIN_IDS.POLYGON]: '0xc35DADB65012eC5796536bD9864eD8773aBc74C4',
  [CHAIN_IDS.XDAI]: '0xc35DADB65012eC5796536bD9864eD8773aBc74C4',
};

const getWethPrice = async (): Promise<number> => {
  const data = await request(EXCHANGE_ENDPOINTS[CHAIN_IDS.ETHEREUM], getWethPriceQuery);
  return data.pair.token0Price;
};

export { EXCHANGE_ENDPOINTS, FACTORY_ADDRESSES, getWethPrice };
