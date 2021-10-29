import arbitrum from "./../imports/images/arbitrum.png";
import avalanche from "./../imports/images/avalanche.png";
import bsc from "./../imports/images/bsc.png";
import celo from "./../imports/images/celo.png";
import ethereum from "./../imports/images/ethereum.png";
import fantom from "./../imports/images/fantom.png";
import harmony from "./../imports/images/harmony.png";
import moonriver from "./../imports/images/moonriver.png";
import polygon from "./../imports/images/polygon.png";
import xdai from "./../imports/images/xdai.png";

export interface INetwork {
    id: number,
    name: string,
    logo: string
}

export const NETWORKS = [
    {
        id: 42161,
        name: "Arbitrum",
        logo: arbitrum
    },
    {
        id: 43114,
        name: "Avalanche",
        logo: avalanche
    },
    {
        id: 56,
        name: "BSC",
        logo: bsc
    },
    {
        id: 42220,
        name: "Celo",
        logo: celo
    },
    {
        id: 1,
        name: "Ethereum",
        logo: ethereum
    },
    {
        id: 250,
        name: "Fantom",
        logo: fantom
    },
    {
        id: 1666600000,
        name: "Harmony",
        logo: harmony
    },
    {
        id: 1285,
        name: "Moonriver",
        logo: moonriver
    },
    {
        id: 137,
        name: "Polygon",
        logo: polygon
    },
    {
        id: 100,
        name: "XDAI",
        logo: xdai
    },
]