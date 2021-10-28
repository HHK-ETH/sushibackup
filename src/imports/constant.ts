import TOKENS_POLYGON from './tokens/polygon.json';
import TOKENS_ETHEREUM from './tokens/ethereum.json';
import batch from './abis/miso/batch.json';
import crowd from './abis/miso/crowd.json';
import dutch from './abis/miso/dutch.json';
import erc20 from './abis/erc20.json';
import masterchef from './abis/masterchef.json';
import slp from './abis/slp.json';
import bento from './abis/bento.json'

export const BENTO_ADDR = {
    1: "0xF5BCE5077908a1b7370B9ae04AdC565EBd643966",
    137: "0x0319000133d3AdA02600f0875d2cf03D442C3367"
};
export const BENTO_ABI = bento;

export const MASTERCHEF_ADDR = "0xc2EdaD668740f1aA35E4D8f227fB8E17dcA888Cd";
export const MASTERCHEF_ABI = masterchef;
export const SLP_ABI = slp;

export const MISO_TYPES_LIST = {
    "BatchAuction": batch,
    "CrowdSale": crowd,
    "DutchAuction": dutch
}

export const ERC20 = erc20;

export const TOKENS = {
    1: TOKENS_ETHEREUM,
    137: TOKENS_POLYGON
}

export const AUCTION_LIST = [
    {
        name: "The Doge NFT (DOG)",
        address: "0x5e29C9Bf97c45e55f1c2257D0Ecf6909726745f3",
        type: "BatchAuction"
    },
    {
        name: "BitDAO (BIT) with SUSHI token",
        address: "0x831dC63790468299c57928809ec4eA34DC8C475f",
        type: "DutchAuction"
    },
    {
        name: "BitDAO (BIT) with ETH token",
        address: "0x4c4564a1FE775D97297F9e3Dc2e762e0Ed5Dda0e",
        type: "DutchAuction"
    },
    {
        name: "Wrapped NCG (WNCG)",
        address: "0x7a004834888586DC68aA39dfB2AE47AF00710a12",
        type: "BatchAuction"
    },
    {
        name: "MaidCoin ($MAID)",
        address: "0x872b40099B7d4c96632ae138834713Ae0B224385",
        type: "DutchAuction"
    },
    {
        name: "DONA (DONA)",
        address: "0xC2704dEc22e552164Dee240B20b840Ea379B878E",
        type: "BatchAuction"
    },
    {
        name: "Ethernaal (NAAL)",
        address: "0xF894EB0c73f37a0f9A4FCB16A3b002b4CFF317fc",
        type: "DutchAuction"
    },
    {
        name: "Ethernaal NFT Pack (ENFT)",
        address: "0x486d4e4c04228f69Ff212a78F95489537f051f8C",
        type: "DutchAuction"
    },
    {
        name: "Non-Fungible Tattoo Token (NF2T)",
        address: "0xd3B68678Fc665c804351Ea7cD525591126C65de7",
        type: "DutchAuction"
    },
    {
        name: "DivergenceProtocol (DIVER)",
        address: "0x4c7e2B2cFF8bb572FA0A3c161aCEA35E02aD4C32",
        type: "DutchAuction"
    },
    {
        name: "MARS4 (MARS4) public",
        address: "0x9FB256ef5465B33a766ecE2F319C178376f6BBF8",
        type: "BatchAuction"
    },
    {
        name: "MARS4 (MARS4) private",
        address: "0xCfce6b93583Db87b1D27054Ca8be713D23A1F801",
        type: "BatchAuction"
    }
]