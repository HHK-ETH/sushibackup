import { useEffect, useState } from 'react';
import { calculateUnwindOutput } from '../helpers/unwindooor';
import useWeb3 from './useWeb3';

type FetchUnwindOutParams = {
  unwindData: any[];
  pairs: any[];
  slippage: number;
};

type FetchUnwindOutReturn = {
  outputs: any[];
  loading: boolean;
  error: string;
};

export default function useFetchUnwindOut(params: FetchUnwindOutParams): FetchUnwindOutReturn {
  const { chainId, provider } = useWeb3();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [outputs, setOutputs]: [priceImpacts: any[], setPriceImpacts: Function] = useState([]);
  const { unwindData, pairs, slippage } = params;

  useEffect(() => {
    const fetchData = async () => {
      if (!provider || !chainId) return;
      setLoading(true);
      const tempPriceImpacts = await Promise.all(
        unwindData.map(async (data, index) => {
          const res: any = await calculateUnwindOutput(chainId, provider, data, pairs[index], slippage);
          if (res.minimumOut.eq(0)) {
            setError(
              'Price impact to high(>6%) for pair: ' +
                pairs[index].token0.symbol +
                '-' +
                pairs[index].token1.symbol +
                '. Try burning the pair instead.'
            );
          }
          return res;
        })
      );
      setOutputs(tempPriceImpacts);
      setLoading(false);
    };
    fetchData();
  }, [unwindData, slippage, provider, chainId, pairs]);

  return { outputs, loading, error };
}
