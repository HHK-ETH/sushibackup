import { BigNumber, Contract } from 'ethers';
import { useCallback } from 'react';
import { ERC20_ABI } from '../imports/abis';
import useTxPending from './useTxPending';
import useWeb3 from './useWeb3';

export default function useApprove(
  tokenAddress: string,
  spender: string,
  amount: BigNumber,
  callback = () => {}
): () => Promise<void> {
  const { chainId, provider } = useWeb3();
  const setTxPending = useTxPending();

  const approve = useCallback(async (): Promise<void> => {
    if (!provider || !chainId) {
      return;
    }
    const erc20 = new Contract(tokenAddress, ERC20_ABI, provider.getSigner());
    const tx = await erc20.approve(spender, amount);
    await setTxPending(tx.hash, 3);
    callback();
  }, [amount, chainId, provider, setTxPending, spender, tokenAddress, callback]);

  return approve;
}
