import kashiPairsEthereum from "./ethereum.json";
import kashiPairsArbitrum from "./arbitrum.json";
import kashiPairsBsc from "./bsc.json";
import kashiPairsPolygon from "./polygon.json";
import kashiPairsXdai from "./xdai.json";
import {IToken} from "./../tokens";
import { CHAIN_IDS } from "../../helpers/network";

export const KASHI_PAIRS: {[id: number]: string[]} = {
    [CHAIN_IDS.ETHEREUM]: kashiPairsEthereum,
    [CHAIN_IDS.ARBITRUM]: kashiPairsArbitrum,
    [CHAIN_IDS.BSC]: kashiPairsBsc,
    [CHAIN_IDS.POLYGON]: kashiPairsPolygon,
    [CHAIN_IDS.XDAI]: kashiPairsXdai
}

export interface IKashiPairData {
    address: string,
    asset: IToken,
    collateral: IToken,
    apr: number,
    totalAsset: number,
    totalBorrow: number,
    utilization: number,
    userAsset: number
}