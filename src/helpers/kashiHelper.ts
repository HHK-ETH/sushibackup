import { Web3Provider } from "@ethersproject/providers";
import { BigNumber, Contract } from "ethers";
import { PRODUCTS } from "./products";
import {IKashiPairData, KASHI_PAIRS} from "./../imports/kashiPairs";
import { getToken, IToken } from "../imports/tokens";
import { formatUnits } from "ethers/lib/utils";

export async function fetchKashiPairsData(web3Provider: Web3Provider, account: string, chainId: number): Promise<IKashiPairData[]> {
    const boringhelper: Contract = new Contract(PRODUCTS["BoringHelper"].networks[chainId], PRODUCTS["BoringHelper"].ABI, web3Provider.getSigner());
    const kashiPairs: string[] = KASHI_PAIRS[chainId];
    const pairsData: any[] = await boringhelper.pollKashiPairs(account, kashiPairs);
    return pairsData.map((pair, index): IKashiPairData => {
      const asset: IToken = getToken(pair.asset, chainId);
      const collateral: IToken = getToken(pair.collateral, chainId);
      const apr: number = parseFloat(formatUnits(BigNumber.from(pair.accrueInfo.interestPerSecond).mul(BigNumber.from(3600*24*365*100))));
      const totalAsset: number = parseFloat(formatUnits(BigNumber.from(pair.totalBorrow.elastic).add(BigNumber.from(pair.totalAsset.elastic)), asset.decimals));
      const totalBorrow: number = parseFloat(formatUnits(BigNumber.from(pair.totalBorrow.elastic), asset.decimals));
      const utilization: number = totalBorrow / totalAsset;
      return {
        address: kashiPairs[index],
        asset: asset,
        collateral: collateral,
        apr: (apr),
        totalAsset: totalAsset,
        totalBorrow: totalBorrow,
        utilization: utilization
      }
    });
}
