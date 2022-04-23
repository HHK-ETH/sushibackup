import { useContext } from 'react';
import { TxPending } from '../context';
import { NETWORKS } from '../helpers/network';
import useWeb3 from './useWeb3';

export default function useTxPending(): (hash: string, confs: number) => Promise<void> {
  const { chainId, provider } = useWeb3();
  const { setTxPending } = useContext(TxPending);

  async function txPending(hash: string, confs: number) {
    if (!chainId || !provider) {
      return;
    }
    setTxPending(NETWORKS[chainId].explorer + 'tx/' + hash);
    await provider.waitForTransaction(hash, confs);
    setTxPending('');
  }

  return txPending;
}
