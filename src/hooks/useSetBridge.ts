import { Contract } from 'ethers';
import { UNWINDOOOR_ADDR } from '../helpers/unwindooor';
import { WETHMAKER_ABI } from '../imports/abis';
import useTxPending from './useTxPending';
import useWeb3 from './useWeb3';

export default function useSetBridge(token: { input: string; bridge: string }): () => Promise<void> {
  const { chainId, provider } = useWeb3();
  const setTxPending = useTxPending();

  async function executeSetBridge() {
    if (!chainId || !provider) return;
    const maker = new Contract(UNWINDOOOR_ADDR[chainId], WETHMAKER_ABI, provider).connect(provider.getSigner());
    const tx = await maker.setBridge(token.input, token.bridge);
    setTxPending(tx.hash, 3);
  }

  return executeSetBridge;
}
