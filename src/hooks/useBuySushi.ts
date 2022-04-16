import { Contract } from 'ethers';
import { useContext } from 'react';
import { TxPending } from '../context';
import { NETWORKS } from '../helpers/network';
import { UNWINDOOOR_ADDR } from '../helpers/unwindooor';
import { SUSHIMAKER_ABI } from '../imports/abis';
import useWeb3 from './useWeb3';

export default function useBuySushi(swapData: any): () => Promise<void> {
  const { provider, chainId } = useWeb3();
  const { setTxPending } = useContext(TxPending);

  async function buySushi() {
    if (!provider || !chainId) return;
    const maker = new Contract(UNWINDOOOR_ADDR[chainId], SUSHIMAKER_ABI, provider).connect(provider.getSigner());
    const tx = await maker.buySushi(swapData.amountIn, swapData.minimumOut);
    setTxPending(NETWORKS[chainId].explorer + 'tx/' + tx.hash);
    await provider.waitForTransaction(tx.hash, 1);
    setTxPending('');
  }

  return buySushi;
}
