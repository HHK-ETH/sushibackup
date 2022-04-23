import { BigNumber, Contract } from 'ethers';
import { useCallback } from 'react';
import { ERC20_ABI } from '../imports/abis';
import useTxPending from './useTxPending';
import useWeb3 from './useWeb3';

export default function useTransferToken(callback = () => {}) {
  const { chainId, provider } = useWeb3();
  const setTxPending = useTxPending();

  const transferToken = useCallback(
    async (tokenAddress: string, amount: BigNumber, receiver: string) => {
      if (!chainId || !provider) {
        return false;
      }
      const erc20 = new Contract(tokenAddress, ERC20_ABI, provider.getSigner());
      const tx = await erc20.transfer(receiver, amount);
      await setTxPending(tx.hash, 10);
      await callback();
    },
    [callback, chainId, provider, setTxPending]
  );

  return transferToken;
}
