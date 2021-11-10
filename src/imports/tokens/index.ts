import { CHAIN_IDS } from "../../helpers/network";
import arbitrum from "./arbitrum.json";
import avalanche from "./avalanche.json";
import bsc from "./bsc.json";
import celo from "./celo.json";
import ethereum from "./ethereum.json";
import fantom from "./fantom.json";
import harmony from "./harmony.json";
import moonriver from "./moonriver.json";
import polygon from "./polygon.json";
import xdai from "./xdai.json";

export interface IToken {
    address: string,
    name: string,
    symbol: string,
    decimals: number,
    logoURI: string
}

export const TOKENS: {[id: number]: IToken[]} = {
    [CHAIN_IDS.ARBITRUM]: arbitrum,
    [CHAIN_IDS.AVALANCHE]: avalanche,
    [CHAIN_IDS.BSC]: bsc,
    [CHAIN_IDS.CELO]: celo,
    [CHAIN_IDS.ETHEREUM]: ethereum,
    [CHAIN_IDS.FANTOM]: fantom,
    [CHAIN_IDS.HARMONY]: harmony,
    [CHAIN_IDS.MOONRIVER]: moonriver,
    [CHAIN_IDS.POLYGON]: polygon,
    [CHAIN_IDS.XDAI]: xdai
}

export function getToken(address: string, chainId: number): IToken {
    const token: IToken | undefined = TOKENS[chainId].find((token) => {
        return token.address === address;
    })
    if (token !== undefined) return token;
    return {
        address: address,
        name: "Unknow token",
        symbol: "UT",
        decimals: 18,
        logoURI: ""
    }
}