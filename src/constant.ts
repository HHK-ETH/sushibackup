import TOKENS_POLYGON from './tokens/polygon.json';
import TOKENS_ETHEREUM from './tokens/ethereum.json';
import batch from './abis/miso/batch.json';
import crowd from './abis/miso/crowd.json';
import dutch from './abis/miso/dutch.json';
import erc20 from './abis/erc20.json';
import masterchef from './abis/masterchef.json';
import slp from './abis/slp.json';

export const BENTO_ADDR = {
    1: "0xF5BCE5077908a1b7370B9ae04AdC565EBd643966",
    137: "0x0319000133d3AdA02600f0875d2cf03D442C3367"
};

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
]