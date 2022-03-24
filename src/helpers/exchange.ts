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
  [CHAIN_IDS.CELO]: 'https://api.thegraph.com/subgraphs/name/sushiswap/celo-exchange',
  [CHAIN_IDS.ETHEREUM]: 'https://api.thegraph.com/subgraphs/name/sushiswap/exchange',
  [CHAIN_IDS.FANTOM]: 'https://api.thegraph.com/subgraphs/name/sushiswap/fantom-exchange',
  [CHAIN_IDS.HARMONY]: 'https://sushi.graph.t.hmny.io/subgraphs/name/sushiswap/harmony-exchange',
  [CHAIN_IDS.MOONRIVER]: 'https://api.thegraph.com/subgraphs/name/sushiswap/moonriver-exchange',
  [CHAIN_IDS.POLYGON]: 'https://api.thegraph.com/subgraphs/name/sushiswap/matic-exchange',
  [CHAIN_IDS.XDAI]: 'https://api.thegraph.com/subgraphs/name/sushiswap/xdai-exchange',
};

const getWethPrice = async (): Promise<number> => {
  const data = await request(EXCHANGE_ENDPOINTS[CHAIN_IDS.ETHEREUM], getWethPriceQuery);
  return data.pair.token0Price;
};

export { EXCHANGE_ENDPOINTS, getWethPrice };
