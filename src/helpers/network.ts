import arbitrum from "./../imports/images/networks/arbitrum.png";
import avalanche from "./../imports/images/networks/avalanche.png";
import bsc from "./../imports/images/networks/bsc.png";
import celo from "./../imports/images/networks/celo.png";
import ethereum from "./../imports/images/networks/ethereum.png";
import fantom from "./../imports/images/networks/fantom.png";
import harmony from "./../imports/images/networks/harmony.png";
import moonriver from "./../imports/images/networks/moonriver.png";
import polygon from "./../imports/images/networks/polygon.png";
import xdai from "./../imports/images/networks/xdai.png";

export interface INetwork {
    id: number,
    name: string,
    logo: string
    rpc: string
}

export enum CHAIN_IDS {
    ETHEREUM = 1,
    BSC = 56,
    POLYGON = 137,
    XDAI = 100,
    FANTOM = 250,
    MOONRIVER = 1285,
    ARBITRUM = 42161,
    CELO = 42220,
    AVALANCHE = 43114,
    HARMONY = 1666600000
}

export const NETWORKS: {[id: number]: INetwork} = {
    [CHAIN_IDS.ARBITRUM]: {
        id: 42161,
        name: "Arbitrum",
        logo: arbitrum,
        rpc: "https://arb1.arbitrum.io/rpc"
    },
    [CHAIN_IDS.AVALANCHE]: {
        id: 43114,
        name: "Avalanche",
        logo: avalanche,
        rpc: "https://api.avax.network/ext/bc/C/rpc"
    },
    [CHAIN_IDS.BSC]: {
        id: 56,
        name: "BSC",
        logo: bsc,
        rpc: "https://bsc-dataseed1.binance.org"
    },
    [CHAIN_IDS.CELO]: {
        id: 42220,
        name: "Celo",
        logo: celo,
        rpc: "https://forno.celo.org"
    },
    [CHAIN_IDS.ETHEREUM]: {
        id: 1,
        name: "Ethereum",
        logo: ethereum,
        rpc: "https://api.mycryptoapi.com/eth"
    },
    [CHAIN_IDS.FANTOM]: {
        id: 250,
        name: "Fantom",
        logo: fantom,
        rpc: "https://rpc.ftm.tools"
    },
    [CHAIN_IDS.HARMONY]: {
        id: 1666600000,
        name: "Harmony",
        logo: harmony,
        rpc: "https://api.harmony.one"
    },
    [CHAIN_IDS.MOONRIVER]: {
        id: 1285,
        name: "Moonriver",
        logo: moonriver,
        rpc: "https://rpc.moonriver.moonbeam.network"
    },
    [CHAIN_IDS.POLYGON]: {
        id: 137,
        name: "Polygon",
        logo: polygon,
        rpc: "https://polygon-rpc.com/"
    },
    [CHAIN_IDS.XDAI]: {
        id: 100,
        name: "XDAI",
        logo: xdai,
        rpc: "https://rpc.xdaichain.com"
    },
}