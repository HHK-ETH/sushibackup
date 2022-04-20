import { BigNumber, Contract } from 'ethers';
import { ERC20_ABI } from '../imports/abis';
import useTxPending from './useTxPending';
import useWeb3 from './useWeb3';

export default function useApprove(tokenAddress: string, spender: string, amount: BigNumber): () => Promise<void> {
  const { chainId, provider } = useWeb3();
  const setTxPending = useTxPending();

  async function approve(): Promise<void> {
    if (!provider || !chainId) {
      return;
    }
    const erc20 = new Contract(tokenAddress, ERC20_ABI, provider.getSigner());
    const tx = await erc20.approve(spender, amount);
    setTxPending(tx.hash, 3);
    return await erc20.allowance(tx.from, spender);
  }

  return approve;
}
