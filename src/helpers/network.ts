import arbitrum from '../imports/images/networks/arbitrum.png';
import avalanche from '../imports/images/networks/avalanche.png';
import bsc from '../imports/images/networks/bsc.png';
import celo from '../imports/images/networks/celo.png';
import ethereum from '../imports/images/networks/ethereum.png';
import fantom from '../imports/images/networks/fantom.png';
import harmony from '../imports/images/networks/harmony.png';
import moonriver from '../imports/images/networks/moonriver.png';
import polygon from '../imports/images/networks/polygon.png';
import gnosis from '../imports/images/networks/gnosis.jpeg';
import fuse from '../imports/images/networks/fuse.png';
import kava from '../imports/images/networks/kava.png';
import boba from '../imports/images/networks/boba.png';
import bttc from '../imports/images/networks/bttc.jpg';
import metis from '../imports/images/networks/metis.png';
import optimism from '../imports/images/networks/optimism.png';
import arbitrum_nova from '../imports/images/networks/nova.png';

interface INetwork {
  id: number;
  name: string;
  logo: string;
  rpc: string;
  zapperId: string;
  explorer: string;
}

enum CHAIN_IDS {
  ETHEREUM = 1,
  OPTIMISM = 10,
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
  FUSE = 122,
  KAVA = 2222,
  BOBA = 288,
  BTTC = 199,
  METIS = 1088,
  ARBITRUM_NOVA = 42170,
}

const NETWORKS: { [id: number]: INetwork } = {
  [CHAIN_IDS.ARBITRUM]: {
    id: 42161,
    name: 'Arbitrum',
    logo: arbitrum,
    rpc: 'https://arb1.arbitrum.io/rpc',
    zapperId: 'arbitrum',
    explorer: 'https://arbiscan.io/',
  },
  [CHAIN_IDS.ARBITRUM_NOVA]: {
    id: 42170,
    name: 'Arbitrum Nova',
    logo: arbitrum_nova,
    rpc: 'https://nova.arbitrum.io/rpc',
    zapperId: 'arbitrum_nova',
    explorer: 'https://nova.arbiscan.io/',
  },
  [CHAIN_IDS.AVALANCHE]: {
    id: 43114,
    name: 'Avalanche',
    logo: avalanche,
    rpc: 'https://api.avax.network/ext/bc/C/rpc',
    zapperId: 'avalanche',
    explorer: 'https://snowtrace.com/',
  },
  [CHAIN_IDS.BSC]: {
    id: 56,
    name: 'BSC',
    logo: bsc,
    rpc: 'https://bsc-dataseed1.binance.org',
    zapperId: 'binance-smart-chain',
    explorer: 'https://bscscan.com/',
  },
  [CHAIN_IDS.CELO]: {
    id: 42220,
    name: 'Celo',
    logo: celo,
    rpc: 'https://forno.celo.org',
    zapperId: 'celo',
    explorer: 'https://explorer.celo.org/',
  },
  [CHAIN_IDS.ETHEREUM]: {
    id: 1,
    name: 'Ethereum',
    logo: ethereum,
    rpc: 'https://cloudflare-eth.com',
    zapperId: 'ethereum',
    explorer: 'https://etherscan.io/',
  },
  [CHAIN_IDS.FANTOM]: {
    id: 250,
    name: 'Fantom',
    logo: fantom,
    rpc: 'https://rpc.ftm.tools',
    zapperId: 'fantom',
    explorer: 'https://ftmscan.com/',
  },
  [CHAIN_IDS.HARMONY]: {
    id: 1666600000,
    name: 'Harmony',
    logo: harmony,
    rpc: 'https://api.harmony.one',
    zapperId: 'harmony',
    explorer: 'https://explorer.harmony.one/',
  },
  [CHAIN_IDS.MOONRIVER]: {
    id: 1285,
    name: 'Moonriver',
    logo: moonriver,
    rpc: 'https://rpc.moonriver.moonbeam.network',
    zapperId: 'moonriver',
    explorer: 'https://moonscan.io/',
  },
  [CHAIN_IDS.MOONBEAM]: {
    id: 1284,
    name: 'Moonbeam',
    logo: moonriver,
    rpc: 'https://rpc.api.moonbeam.network',
    zapperId: 'moonbeam',
    explorer: 'https://moonbeam.moonscan.io',
  },
  [CHAIN_IDS.POLYGON]: {
    id: 137,
    name: 'Polygon',
    logo: polygon,
    rpc: 'https://polygon-rpc.com/',
    zapperId: 'polygon',
    explorer: 'https://polygonscan.com/',
  },
  [CHAIN_IDS.XDAI]: {
    id: 100,
    name: 'Gnosis chain',
    logo: gnosis,
    rpc: 'https://rpc.gnosischain.com/',
    zapperId: 'gnosis',
    explorer: 'https://blockscout.com/xdai/mainnet/',
  },
  [CHAIN_IDS.FUSE]: {
    id: 100,
    name: 'Fuse chain',
    logo: fuse,
    rpc: 'https://rpc.fuse.io/',
    zapperId: 'fuse',
    explorer: 'https://explorer.fuse.io/',
  },
  [CHAIN_IDS.KAVA]: {
    id: CHAIN_IDS.KAVA,
    name: 'Kava chain',
    logo: kava,
    rpc: 'https://evm.kava.io',
    zapperId: 'kava',
    explorer: 'https://explorer.kava.io/',
  },
  [CHAIN_IDS.BOBA]: {
    id: CHAIN_IDS.BOBA,
    name: 'Boba chain',
    logo: boba,
    rpc: 'https://mainnet.boba.network',
    zapperId: 'boba',
    explorer: 'https://bobascan.com/',
  },
  [CHAIN_IDS.BTTC]: {
    id: CHAIN_IDS.BTTC,
    name: 'BTTC chain',
    logo: bttc,
    rpc: 'https://rpc.bittorrentchain.io',
    zapperId: 'bttc',
    explorer: 'https://bttcscan.com/',
  },
  [CHAIN_IDS.METIS]: {
    id: CHAIN_IDS.METIS,
    name: 'Metis chain',
    logo: metis,
    rpc: 'https://andromeda.metis.io/?owner=1088',
    zapperId: 'metis',
    explorer: 'https://andromeda-explorer.metis.io/',
  },
  [CHAIN_IDS.OPTIMISM]: {
    id: CHAIN_IDS.OPTIMISM,
    name: 'Optimism',
    logo: optimism,
    rpc: 'https://mainnet.optimism.io',
    zapperId: 'optimism',
    explorer: 'https://optimistic.etherscan.io/',
  },
};

export { CHAIN_IDS, NETWORKS };
