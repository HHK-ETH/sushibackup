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

export const NETWORKS = [
    {
        id: 42161,
        name: "Arbitrum",
        logo: arbitrum,
        rpc: "https://arb1.arbitrum.io/rpc"
    },
    {
        id: 43114,
        name: "Avalanche",
        logo: avalanche,
        rpc: "https://api.avax.network/ext/bc/C/rpc"
    },
    {
        id: 56,
        name: "BSC",
        logo: bsc,
        rpc: "https://bsc-dataseed1.binance.org"
    },
    {
        id: 42220,
        name: "Celo",
        logo: celo,
        rpc: "https://forno.celo.org"
    },
    {
        id: 1,
        name: "Ethereum",
        logo: ethereum,
        rpc: "https://api.mycryptoapi.com/eth"
    },
    {
        id: 250,
        name: "Fantom",
        logo: fantom,
        rpc: "https://rpc.ftm.tools"
    },
    {
        id: 1666600000,
        name: "Harmony",
        logo: harmony,
        rpc: "https://api.harmony.one"
    },
    {
        id: 1285,
        name: "Moonriver",
        logo: moonriver,
        rpc: "https://rpc.moonriver.moonbeam.network"
    },
    {
        id: 137,
        name: "Polygon",
        logo: polygon,
        rpc: "https://polygon-rpc.com/"
    },
    {
        id: 100,
        name: "XDAI",
        logo: xdai,
        rpc: "https://rpc.xdaichain.com"
    },
]