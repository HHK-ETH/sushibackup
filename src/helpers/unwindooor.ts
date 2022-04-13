import { request, gql } from 'graphql-request';
import { CHAIN_IDS } from './network';
import { EXCHANGE_ENDPOINTS, FACTORY_ADDRESSES } from './exchange';
import { WethMaker } from 'unwindooor-sdk';
import { getAddress } from 'ethers/lib/utils';
import { BigNumber, Contract } from 'ethers';
import { WETH } from '../imports/tokens';
import wethMakerABI from '../imports/abis/wethMaker.json';
import erc20Abi from '../imports/abis/erc20.json';

const pairQuery = `
  pair {
    id
    reserveUSD
    totalSupply
    name
    reserve0
    reserve1
    token0 {
      id
      symbol
      name
      decimals
    }
    token1 {
      id
      name
      symbol
      decimals
    }
  }
`;

const QUERY = gql`
    query positions ($feeTo: ID!) {
      user(id: $feeTo) {
        lp1: liquidityPositions(first: 1000, orderBy: timestamp, orderDirection: desc) {
          ${pairQuery}
          liquidityTokenBalance
        }
        lp2: liquidityPositions(skip: 1000, first: 1000, orderBy: timestamp, orderDirection: desc) {
          ${pairQuery}
          liquidityTokenBalance
        }
      }
    }
  `;

const UNWINDOOOR_ADDR: { [chainId: number]: string } = {
  [CHAIN_IDS.ARBITRUM]: '0xa19b3b22f29E23e4c04678C94CFC3e8f202137d8',
  [CHAIN_IDS.AVALANCHE]: '0x560C759A11cd026405F6f2e19c65Da1181995fA2',
  [CHAIN_IDS.BSC]: '0x4736c58BfB626C96D344Be2fC04e420aE283E9E8',
  [CHAIN_IDS.CELO]: '0xB6E90eBe44De40aEb0b987adC2D7d9dd0EC918d7',
  [CHAIN_IDS.ETHEREUM]: '0x5ad6211CD3fdE39A9cECB5df6f380b8263d1e277',
  [CHAIN_IDS.FANTOM]: '0x4736c58BfB626C96D344Be2fC04e420aE283E9E8',
  [CHAIN_IDS.HARMONY]: '0x560C759A11cd026405F6f2e19c65Da1181995fA2',
  [CHAIN_IDS.MOONRIVER]: '0xa19b3b22f29E23e4c04678C94CFC3e8f202137d8',
  [CHAIN_IDS.POLYGON]: '0xf1c9881Be22EBF108B8927c4d197d126346b5036',
  [CHAIN_IDS.XDAI]: '0x1026cbed7b7E851426b959BC69dcC1bf5876512d',
};

const queryUnwindooorPositions = async (chainId: number): Promise<any> => {
  return await queryPositions(UNWINDOOOR_ADDR[chainId].toLowerCase(), chainId);
};

const queryPositions = async (address: string, chainId: number): Promise<any> => {
  let res = await request(EXCHANGE_ENDPOINTS[chainId], QUERY, {
    feeTo: address.toLowerCase(),
  });
  let totalFees = 0;
  if (res.user === null) {
    return {
      positions: [],
      totalFees: 0,
    };
  }
  const positions: any[] = [...res.user.lp1, ...res.user.lp2].sort((positionA: any, positionB: any) => {
    const pairA = positionA.pair;
    const valueA = (positionA.liquidityTokenBalance / pairA.totalSupply) * pairA.reserveUSD;
    const pairB = positionB.pair;
    const valueB = (positionB.liquidityTokenBalance / pairB.totalSupply) * pairB.reserveUSD;
    if (valueA > valueB) return -1;
    return +1;
  });
  if (positions.length > 250) {
    positions.splice(250);
  }
  positions.forEach((position: any) => {
    const pair = position.pair;
    if (pair.totalSupply > 0) {
      const value = (position.liquidityTokenBalance / pair.totalSupply) * pair.reserveUSD;
      totalFees += value;
    }
  });
  return {
    positions: positions,
    totalFees: totalFees,
  };
};

const initWethmaker = (
  chainId: number | undefined,
  slippage: number,
  provider: any,
  prefTokens: string[]
): WethMaker => {
  return new WethMaker({
    wethMakerAddress: chainId ? UNWINDOOOR_ADDR[chainId] : UNWINDOOOR_ADDR[1],
    preferTokens: prefTokens,
    provider: provider,
    maxPriceImpact: BigNumber.from(60),
    priceSlippage: BigNumber.from(slippage * 10),
    wethAddress: chainId ? WETH[chainId] : WETH[1],
    sushiAddress: '0x6b3595068778dd592e39a122f4f5a5cf09c90fe2',
    factoryAddress: chainId ? FACTORY_ADDRESSES[chainId] : FACTORY_ADDRESSES[1],
  });
};

const calculateUnwindOutput = async (
  chainId: number | undefined,
  provider: any,
  data: any,
  pair: any,
  slippage: number
): Promise<any> => {
  const wethMaker = initWethmaker(chainId, slippage, provider, [getAddress(data.prefToken)]);
  try {
    const { amount, minimumOut, keepToken0 } = await wethMaker.unwindPair(pair.id, BigNumber.from(data.share));
    const { reserve0, reserve1, totalSupply } = await wethMaker._getUnwindData(pair.id);
    const noPiAmountOut = keepToken0
      ? amount.mul(reserve0).div(totalSupply).mul(2)
      : amount.mul(reserve1).div(totalSupply).mul(2);
    return { amount: amount, minimumOut: minimumOut, noPiAmountOut: noPiAmountOut, keepToken0: keepToken0 };
  } catch (e: any) {
    return {
      amount: BigNumber.from(0),
      minimumOut: BigNumber.from(0),
      noPiAmountOut: BigNumber.from(0),
      keepToken0: true,
    };
  }
};

const calculateBuyWethOutput = async (chainId: number, provider: any, slippage: number, swapList: any[]) => {
  const wethMaker = initWethmaker(chainId, slippage, provider, []);
  const wethMakerContract = new Contract(UNWINDOOOR_ADDR[chainId], wethMakerABI, provider);
  const tempOutputs = await Promise.all(
    swapList.map(async (swap: any) => {
      try {
        const bridge = await wethMakerContract.bridges(swap.token);
        const outputToken = new Contract(
          bridge === '0x0000000000000000000000000000000000000000' ? WETH[chainId] : bridge,
          erc20Abi,
          provider
        );
        const { amountIn, minimumOut } = await wethMaker.sellToken(swap.token, swap.share);
        const pairAddress = await wethMaker._getPair(swap.token);
        const { token0, reserve0, reserve1 } = await wethMaker._getMarketData(pairAddress, swap.token);
        const sellingToken0 = swap.token.toUpperCase() === token0.toUpperCase();
        const reserveIn = sellingToken0 ? reserve0 : reserve1;
        const reserveOut = sellingToken0 ? reserve1 : reserve0;
        const noPriceImpactAmountOut = reserveOut.mul(amountIn).div(reserveIn);
        return {
          amountIn: amountIn,
          minimumOut: minimumOut,
          noPriceImpactAmountOut: noPriceImpactAmountOut,
          decimals: await outputToken.decimals(),
          symbol: await outputToken.symbol(),
        };
      } catch (error) {
        return {
          amountIn: BigNumber.from(0),
          minimumOut: BigNumber.from(0),
          noPriceImpactAmountOut: BigNumber.from(0),
          decimals: BigNumber.from(18),
          symbol: '<!>',
        };
      }
    })
  );
  return tempOutputs;
};

const calculateBuySushiOutput = async (chainId: number, provider: any, slippage: number, share: number) => {
  const wethMaker = initWethmaker(chainId, slippage, provider, []);
  try {
    const { amountIn, minimumOut } = await wethMaker.sellToken(WETH[1], BigNumber.from(share));
    const { reserve0, reserve1 } = await wethMaker._getMarketData(
      '0x795065dcc9f64b5614c407a6efdc400da6221fb0',
      WETH[1]
    );
    const noPriceImpactAmountOut = reserve0.mul(amountIn).div(reserve1);
    return { amountIn: amountIn, minimumOut: minimumOut, noPriceImpactAmountOut: noPriceImpactAmountOut };
  } catch (error) {
    return { amountIn: BigNumber.from(0), minimumOut: BigNumber.from(0), noPriceImpactAmountOut: BigNumber.from(0) };
  }
};

export {
  UNWINDOOOR_ADDR,
  queryUnwindooorPositions,
  queryPositions,
  calculateUnwindOutput,
  calculateBuyWethOutput,
  calculateBuySushiOutput,
};
