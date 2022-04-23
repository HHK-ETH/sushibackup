import { BigNumber, Contract } from 'ethers';
import { parseUnits } from 'ethers/lib/utils';
import { useCallback, useEffect, useState } from 'react';
import { CONSTANT_PRODUCT_POOL_ABI } from '../../imports/abis';
import useWeb3 from '../useWeb3';

export default function useFetchMinimumOutCPP(lpAddress: string, balance: string, slippage: number) {
  const { chainId, provider } = useWeb3();
  const [loading, setLoading] = useState(false);
  const [minimumOut, setMinimumOut] = useState({ token0: BigNumber.from(0), token1: BigNumber.from(0) });

  const fetchMinimumOutCPP = useCallback(async () => {
    if (!chainId || !provider) {
      return;
    }
    setLoading(true);
    const lp = new Contract(lpAddress, CONSTANT_PRODUCT_POOL_ABI, provider);
    const totalSupply = await lp.totalSupply();
    const ratio = parseUnits(balance)
      .mul(BigNumber.from(10e12))
      .mul(100 - slippage)
      .div(100)
      .div(totalSupply);
    const reserves = await lp.getReserves();
    console.log(reserves);
    setMinimumOut({
      token0: reserves[0].mul(ratio).div(BigNumber.from(10e12)),
      token1: reserves[1].mul(ratio).div(BigNumber.from(10e12)),
    });
    setLoading(false);
  }, [slippage, balance, chainId, provider, lpAddress]);

  useEffect(() => {
    fetchMinimumOutCPP();
  }, [fetchMinimumOutCPP]);

  return { minimumOut, loading, fetchMinimumOutCPP };
}
