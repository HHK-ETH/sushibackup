import { CHAIN_IDS } from './network';

const EXCHANGE_ENDPOINTS: { [chainId: number]: string } = {
  [CHAIN_IDS.ARBITRUM]: 'https://api.thegraph.com/subgraphs/name/sushiswap/arbitrum-minichef',
  [CHAIN_IDS.AVALANCHE]: 'https://api.thegraph.com/subgraphs/name/sushiswap/avalanche-exchange',
  [CHAIN_IDS.BSC]: 'https://api.thegraph.com/subgraphs/name/sushiswap/bsc-exchange',
  [CHAIN_IDS.CELO]: 'https://api.thegraph.com/subgraphs/name/sushiswap/celo-minichef-v2',
  [CHAIN_IDS.ETHEREUM]: 'https://api.thegraph.com/subgraphs/name/sushiswap/exchange',
  [CHAIN_IDS.FANTOM]: 'https://api.thegraph.com/subgraphs/name/sushiswap/fantom-exchange',
  [CHAIN_IDS.HARMONY]: 'https://sushi.graph.t.hmny.io/subgraphs/name/sushiswap/harmony-minichef',
  [CHAIN_IDS.MOONRIVER]: 'https://api.thegraph.com/subgraphs/name/sushiswap/moonriver-minichef',
  [CHAIN_IDS.POLYGON]: 'https://api.thegraph.com/subgraphs/name/sushiswap/matic-minichef',
  [CHAIN_IDS.XDAI]: 'https://api.thegraph.com/subgraphs/name/matthewlilley/xdai-minichef',
};

export { EXCHANGE_ENDPOINTS };
