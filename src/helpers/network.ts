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

export const NETWORKS: {[id: number]: INetwork} = {
    42161: {
        id: 42161,
        name: "Arbitrum",
        logo: arbitrum,
        rpc: "https://arb1.arbitrum.io/rpc"
    },
    43114: {
        id: 43114,
        name: "Avalanche",
        logo: avalanche,
        rpc: "https://api.avax.network/ext/bc/C/rpc"
    },
    56: {
        id: 56,
        name: "BSC",
        logo: bsc,
        rpc: "https://bsc-dataseed1.binance.org"
    },
    42220: {
        id: 42220,
        name: "Celo",
        logo: celo,
        rpc: "https://forno.celo.org"
    },
    1: {
        id: 1,
        name: "Ethereum",
        logo: ethereum,
        rpc: "https://api.mycryptoapi.com/eth"
    },
    250: {
        id: 250,
        name: "Fantom",
        logo: fantom,
        rpc: "https://rpc.ftm.tools"
    },
    1666600000: {
        id: 1666600000,
        name: "Harmony",
        logo: harmony,
        rpc: "https://api.harmony.one"
    },
    1285: {
        id: 1285,
        name: "Moonriver",
        logo: moonriver,
        rpc: "https://rpc.moonriver.moonbeam.network"
    },
    137: {
        id: 137,
        name: "Polygon",
        logo: polygon,
        rpc: "https://polygon-rpc.com/"
    },
    100: {
        id: 100,
        name: "XDAI",
        logo: xdai,
        rpc: "https://rpc.xdaichain.com"
    },
}