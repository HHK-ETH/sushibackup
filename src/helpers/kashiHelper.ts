import { Web3Provider } from "@ethersproject/providers";
import { BigNumber, Contract } from "ethers";
import { PRODUCTS, PRODUCT_IDS } from "./products";
import { IKashiPairData, KASHI_PAIRS } from "./../imports/kashiPairs";
import { getToken, IToken } from "../imports/tokens";
import { formatUnits } from "ethers/lib/utils";

export async function fetchKashiPairsData(
  web3Provider: Web3Provider,
  account: string,
  chainId: number
): Promise<IKashiPairData[]> {
  const boringhelper: Contract = new Contract(
    PRODUCTS[PRODUCT_IDS.BORING_HELPER].networks[chainId],
    PRODUCTS[PRODUCT_IDS.BORING_HELPER].ABI,
    web3Provider.getSigner()
  );
  const kashiPairs: string[] = KASHI_PAIRS[chainId];
  const pairsData: any[] = await boringhelper.pollKashiPairs(
    account,
    kashiPairs
  );
  return (await Promise.all(pairsData
    .map(async(pair, index): Promise<IKashiPairData> => {
      const asset: IToken = getToken(pair.asset, chainId);
      const collateral: IToken = getToken(pair.collateral, chainId);
      const apr: number = parseFloat(
        formatUnits(
          BigNumber.from(pair.accrueInfo.interestPerSecond).mul(
            BigNumber.from(3600 * 24 * 365 * 100)
          )
        )
      );
      const totalAsset: number = parseFloat(
        formatUnits(
          BigNumber.from(pair.totalBorrow.elastic).add(
            BigNumber.from(pair.totalAsset.elastic)
          ),
          asset.decimals
        )
      );
      const totalBorrow: number = parseFloat(
        formatUnits(BigNumber.from(pair.totalBorrow.elastic), asset.decimals)
      );
      const bentoContract: Contract = new Contract(PRODUCTS[PRODUCT_IDS.BENTOBOX].networks[chainId], PRODUCTS[PRODUCT_IDS.BENTOBOX].ABI, web3Provider.getSigner());
      const utilization: number = totalBorrow / totalAsset;
      const allShare = pair.totalAsset.elastic.add(
        await bentoContract.toShare(asset.address, pair.totalBorrow.elastic, true)
      );
      const userShares = pair.totalAsset.base.gt(0) ? pair.userAssetFraction.mul(allShare).div(pair.totalAsset.base) : 0;
      const userAsset = parseFloat(formatUnits(await bentoContract.toAmount(asset.address, userShares, true), asset.decimals));
      return {
        address: kashiPairs[index],
        asset: asset,
        collateral: collateral,
        apr: apr,
        totalAsset: totalAsset,
        totalBorrow: totalBorrow,
        utilization: utilization,
        userAsset: userAsset,
      };
    }))).sort((pairA: IKashiPairData, pairB: IKashiPairData) => {
      return pairA.apr > pairB.apr ? -1 : 1;
    });
}
