import { Contract } from 'ethers';
import { BENTOBOX_ADDR } from '../../helpers/bentobox';
import { BENTO_ABI } from '../../imports/abis';
import useTxPending from '../useTxPending';
import useWeb3 from '../useWeb3';

export default function useWithdrawBento(account: string | undefined | null) {
  const { chainId, provider } = useWeb3();
  const setTxPending = useTxPending();

  async function withdraw(token: string, share: string) {
    if (!provider || !chainId || !account) return;
    let bentobox = new Contract(BENTOBOX_ADDR[chainId], BENTO_ABI, provider);
    bentobox = bentobox.connect(provider.getSigner());
    const tx = await bentobox.withdraw(token, account, account, 0, share);
    setTxPending(tx.hash, 3);
  }

  return withdraw;
}