import arbitrum from '../imports/images/networks/arbitrum.png';
import avalanche from '../imports/images/networks/avalanche.png';
import bsc from '../imports/images/networks/bsc.png';
import celo from '../imports/images/networks/celo.png';
import ethereum from '../imports/images/networks/ethereum.png';
import fantom from '../imports/images/networks/fantom.png';
import harmony from '../imports/images/networks/harmony.png';
import moonriver from '../imports/images/networks/moonriver.png';
import polygon from '../imports/images/networks/polygon.png';
import xdai from '../imports/images/networks/xdai.png';

interface INetwork {
  id: number;
  name: string;
  logo: string;
  rpc: string;
  coingeckoId: string;
  explorer: string;
}

enum CHAIN_IDS {
  ETHEREUM = 1,
  BSC = 56,
  POLYGON = 137,
  XDAI = 100,
  FANTOM = 250,
  MOONRIVER = 1285,
  MOONBEAM = 1284,
  ARBITRUM = 42161,
  CELO = 42220,
  AVALANCHE = 43114,
  HARMONY = 1666600000,
}

const NETWORKS: { [id: number]: INetwork } = {
  [CHAIN_IDS.ARBITRUM]: {
    id: 42161,
    name: 'Arbitrum',
    logo: arbitrum,
    rpc: 'https://arb1.arbitrum.io/rpc',
    coingeckoId: 'arbitrum-one',
    explorer: 'https://arbiscan.io/',
  },
  [CHAIN_IDS.AVALANCHE]: {
    id: 43114,
    name: 'Avalanche',
    logo: avalanche,
    rpc: 'https://api.avax.network/ext/bc/C/rpc',
    coingeckoId: 'avalanche',
    explorer: 'https://snowtrace.com/',
  },
  [CHAIN_IDS.BSC]: {
    id: 56,
    name: 'BSC',
    logo: bsc,
    rpc: 'https://bsc-dataseed1.binance.org',
    coingeckoId: 'binance-smart-chain',
    explorer: 'https://bscscan.com/',
  },
  [CHAIN_IDS.CELO]: {
    id: 42220,
    name: 'Celo',
    logo: celo,
    rpc: 'https://forno.celo.org',
    coingeckoId: 'celo',
    explorer: 'https://explorer.celo.org/',
  },
  [CHAIN_IDS.ETHEREUM]: {
    id: 1,
    name: 'Ethereum',
    logo: ethereum,
    rpc: 'https://api.mycryptoapi.com/eth',
    coingeckoId: 'ethereum',
    explorer: 'https://etherscan.io/',
  },
  [CHAIN_IDS.FANTOM]: {
    id: 250,
    name: 'Fantom',
    logo: fantom,
    rpc: 'https://rpc.ftm.tools',
    coingeckoId: 'fantom',
    explorer: 'https://ftmscan.com/',
  },
  [CHAIN_IDS.HARMONY]: {
    id: 1666600000,
    name: 'Harmony',
    logo: harmony,
    rpc: 'https://api.harmony.one',
    coingeckoId: 'harmony-shard-0',
    explorer: 'https://explorer.harmony.one/',
  },
  [CHAIN_IDS.MOONRIVER]: {
    id: 1285,
    name: 'Moonriver',
    logo: moonriver,
    rpc: 'https://rpc.moonriver.moonbeam.network',
    coingeckoId: 'moonriver',
    explorer: 'https://moonscan.io/',
  },
  [CHAIN_IDS.MOONBEAM]: {
    id: 1284,
    name: 'Moonbeam',
    logo: moonriver,
    rpc: 'https://rpc.api.moonbeam.network',
    coingeckoId: 'moonbeam',
    explorer: 'https://moonbeam.moonscan.io',
  },
  [CHAIN_IDS.POLYGON]: {
    id: 137,
    name: 'Polygon',
    logo: polygon,
    rpc: 'https://polygon-rpc.com/',
    coingeckoId: 'polygon-pos',
    explorer: 'https://polygonscan.com/',
  },
  [CHAIN_IDS.XDAI]: {
    id: 100,
    name: 'XDAI',
    logo: xdai,
    rpc: 'https://rpc.xdaichain.com',
    coingeckoId: 'xdai',
    explorer: 'https://blockscout.com/xdai/mainnet/',
  },
};

export { CHAIN_IDS, NETWORKS };
