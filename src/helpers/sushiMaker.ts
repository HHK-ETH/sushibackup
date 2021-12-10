import { Web3Provider } from "@ethersproject/providers";
import { BigNumber, Contract } from "ethers";
import { PRODUCTS, PRODUCT_IDS } from "./products";
import { getToken, WETH, WNATIVE } from "./../imports/tokens";
import { formatUnits } from "ethers/lib/utils";
import { NETWORKS } from "./network";

export interface IPairData {
  name: string;
  tokenA: string;
  tokenB: string;
  value: number;
}

export async function getAllpairs(
  web3Provider: Web3Provider,
  chainId: number
): Promise<IPairData[]> {
  const sushiFactory: Contract = new Contract(
    PRODUCTS[PRODUCT_IDS.SUSHI_MAKER].networks[chainId],
    PRODUCTS[PRODUCT_IDS.SUSHI_MAKER].ABI,
    web3Provider
  );
  const boringHelper: Contract = new Contract(
    PRODUCTS[PRODUCT_IDS.BORING_HELPER].networks[chainId],
    PRODUCTS[PRODUCT_IDS.BORING_HELPER].ABI,
    web3Provider
  );
  const feeTo: string = await sushiFactory.feeTo();
  const pairsLength: BigNumber = await sushiFactory.allPairsLength();
  const pairInfos = await getPairInfos(
    boringHelper,
    sushiFactory.address,
    pairsLength
  );
  const pairAddresses = pairInfos.map((pair: any) => {
    return pair.token;
  });
  const tokenAddresses: string[] = [];
  pairInfos.map((pair: any) => {
    const weth = WETH[chainId];
    const wNative = WNATIVE[chainId];
    if (
      weth.toLowerCase() === pair.token0.toLowerCase() ||
      weth.toLowerCase() === pair.token1.toLowerCase()
    )
      return;
    if (
      wNative.toLowerCase() === pair.token0.toLowerCase() ||
      wNative.toLowerCase() === pair.token1.toLowerCase()
    )
      return;
    if (tokenAddresses.indexOf(pair.token0) === -1)
      tokenAddresses.push(pair.token0);
    if (tokenAddresses.indexOf(pair.token1) === -1)
      tokenAddresses.push(pair.token1);
  });
  tokenAddresses.push(WETH[chainId]);
  tokenAddresses.push(WNATIVE[chainId]);
  console.log(tokenAddresses);
  const prices = await getCoingeckoPrices(
    NETWORKS[chainId].coingeckoId,
    tokenAddresses
  );
  const pairBalances = await getPairBalances(
    boringHelper,
    feeTo,
    pairAddresses
  );
  return pairInfos.map((pair: any, index: number): IPairData => {
    const pairBalance = pairBalances[index];
    const value = getPairValue(pair, pairBalance, prices, chainId);
    return {
      name:
        getToken(pair.token0, chainId).symbol +
        "/" +
        getToken(pair.token1, chainId).symbol,
      tokenA: pair.token0,
      tokenB: pair.token1,
      value: value,
    };
  });
}

export async function getPairInfos(
  boringHelper: Contract,
  sushiFactory: string,
  length: BigNumber
): Promise<any[]> {
  const pairs: any[] = [];
  for (let i = 0; i < length.toNumber(); i += 250) {
    const max = i + 250 > length.toNumber() ? length : i + 250;
    pairs.push(...(await boringHelper.getPairs(sushiFactory, i, max)));
  }
  return pairs;
}

export async function getPairBalances(
  boringHelper: Contract,
  feeTo: string,
  pairAddresses: string[]
): Promise<any[]> {
  const pairs: any[] = [];
  for (let i = 0; i < pairAddresses.length; i += 250) {
    const tempAddr = pairAddresses.slice(i, i + 250);
    pairs.push(...(await boringHelper.pollPairs(feeTo, tempAddr)));
  }
  return pairs;
}

export function getPairValue(
  pair: any,
  pairBalance: any,
  prices: any,
  chainId: number
): number {
  const totalSupply: number = parseFloat(formatUnits(pairBalance.totalSupply));
  const balance: number = parseFloat(formatUnits(pairBalance.balance));
  const share: number = !isNaN(balance / totalSupply)
    ? balance / totalSupply
    : 0;
  if (prices[pair.token0.toLowerCase()] !== undefined) {
    return parseFloat(
      formatUnits(
        pairBalance.reserve0,
        getToken(pair.token0, chainId).decimals
      )
    ) * prices[pair.token0.toLowerCase()] * 2 * share;
  }
  if (prices[pair.token1.toLowerCase()] !== undefined) {
    return parseFloat(
      formatUnits(
        pairBalance.reserve1,
        getToken(pair.token1, chainId).decimals
      )
    ) * prices[pair.token1.toLowerCase()] * 2 * share;
  }
  else return 0;
}

export async function getCoingeckoPrices(
  coingeckoChainId: string,
  addresses: string[]
) {
  const prices: { [address: string]: number } = {};
  for (let i = 0; i < addresses.length; i += 100) {
    const tempAddr = addresses.slice(i, i + 100);
    const res = await fetch(
      `https://api.coingecko.com/api/v3/simple/token_price/${coingeckoChainId}?contract_addresses=${tempAddr.join(
        ","
      )}&vs_currencies=usd`,
      { method: "GET" }
    );
    const temp = await res.json();
    Object.keys(temp).map((address: string) => {
      prices[address] = temp[address].usd;
    });
  }
  return prices;
}
