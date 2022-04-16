import { BigNumber } from 'ethers';
import { useEffect, useState } from 'react';
import { calculateBuySushiOutput } from '../helpers/unwindooor';
import useWeb3 from './useWeb3';

type SwapData = {
  amountIn: BigNumber;
  minimumOut: BigNumber;
  noPriceImpactAmountOut: BigNumber;
};

type fetchMinimumOutParams = {
  slippage: number;
  share: number;
};

export default function useFecthMinimumOut(params: fetchMinimumOutParams): {
  swapData: SwapData;
  error: string;
  loading: boolean;
} {
  const { provider, chainId } = useWeb3();
  const [swapData, setSwapData] = useState({
    amountIn: BigNumber.from(0),
    minimumOut: BigNumber.from(0),
    noPriceImpactAmountOut: BigNumber.from(0),
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMinimumOut = async () => {
      if (!provider || !chainId) return;
      setLoading(true);
      const res = await calculateBuySushiOutput(chainId, provider, params.slippage, params.share);
      if (res.minimumOut.eq(0)) {
        setError('Price impact to high. Try reducing the amount of WETH to use.');
      } else {
        setError('');
      }
      setSwapData(res);
      setLoading(false);
    };
    fetchMinimumOut();
  }, [params.share, params.slippage, provider, chainId]);

  return { swapData, error, loading };
}
