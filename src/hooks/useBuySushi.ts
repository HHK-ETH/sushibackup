import { Contract } from 'ethers';
import { UNWINDOOOR_ADDR } from '../helpers/unwindooor';
import { SUSHIMAKER_ABI } from '../imports/abis';
import useTxPending from './useTxPending';
import useWeb3 from './useWeb3';

export default function useBuySushi(swapData: any): () => Promise<void> {
  const { provider, chainId } = useWeb3();
  const setTxPending = useTxPending();

  async function buySushi() {
    if (!provider || !chainId) return;
    const maker = new Contract(UNWINDOOOR_ADDR[chainId], SUSHIMAKER_ABI, provider).connect(provider.getSigner());
    const tx = await maker.buySushi(swapData.amountIn, swapData.minimumOut);
    await setTxPending(tx.hash, 3);
  }

  return buySushi;
}
