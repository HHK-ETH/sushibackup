import { BigNumber, Contract } from 'ethers';
import { useCallback, useEffect, useState } from 'react';
import { ERC20_ABI } from '../imports/abis';
import useWeb3 from './useWeb3';

export default function useFetchAllowance(tokenAddress: string, account: string | null | undefined, spender: string) {
  const { chainId, provider } = useWeb3();
  const [allowance, setAllowance] = useState(BigNumber.from(0));
  const [loading, setLoading] = useState(false);

  const fetchAllowance = useCallback(async () => {
    if (!provider || !account || !chainId) {
      return;
    }
    setLoading(true);
    const token = new Contract(tokenAddress, ERC20_ABI, provider);
    setAllowance(await token.allowance(account, spender));
    setLoading(false);
  }, [provider, account, chainId, spender, tokenAddress]);

  useEffect(() => {
    fetchAllowance();
  }, [fetchAllowance]);

  return { allowance, loading, fetchAllowance };
}
