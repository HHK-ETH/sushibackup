import TOKENS_POLYGON from './tokens/polygon.json';
import TOKENS_ETHEREUM from './tokens/ethereum.json';
import batch from './abis/miso/batch.json';
import crowd from './abis/miso/crowd.json';
import dutch from './abis/miso/dutch.json';

export const BENTO_ADDR = {
    1: "0xF5BCE5077908a1b7370B9ae04AdC565EBd643966",
    137: "0x0319000133d3AdA02600f0875d2cf03D442C3367"
};

export const MISO_TYPES_LIST = {
    "BatchAuction": batch,
    "CrowdSale": crowd,
    "DutchAuction": dutch
}

export const TOKENS = {
    1: TOKENS_ETHEREUM,
    137: TOKENS_POLYGON
}