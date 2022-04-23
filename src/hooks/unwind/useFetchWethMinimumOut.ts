import { BigNumber } from 'ethers';
import { useEffect, useState } from 'react';
import { calculateBuyWethOutput } from '../../helpers/unwindooor';
import useWeb3 from './../useWeb3';

export default function useFetchWethMinimumOut(slippage: number, selectedTokens: any[], shares: BigNumber[]) {
  const { provider, chainId } = useWeb3();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [outputs, setOutputs]: [outputs: any, setOutputs: Function] = useState([]);

  useEffect(() => {
    const fetchOutputs = async () => {
      if (!provider || !chainId) return;
      setLoading(true);
      const res = await calculateBuyWethOutput(chainId, provider, slippage, selectedTokens, shares);
      if (
        res.find((e) => {
          return e.minimumOut.eq(0);
        })
      ) {
        setError('Price impact to high or Unknown token.');
      } else {
        setError('');
      }
      setOutputs(res);
      setLoading(false);
    };
    fetchOutputs();
  }, [chainId, provider, selectedTokens, slippage, shares]);

  return { outputs, loading, error };
}
