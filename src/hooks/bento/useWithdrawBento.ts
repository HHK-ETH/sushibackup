import { BigNumber, Contract } from 'ethers';
import { BENTOBOX_ADDR } from '../../helpers/bentobox';
import { BENTO_ABI } from '../../imports/abis';
import useTxPending from '../useTxPending';
import useWeb3 from '../useWeb3';

export default function useWithdrawBento(account: string | undefined | null, fetchBalances: () => Promise<void>) {
  const { chainId, provider } = useWeb3();
  const setTxPending = useTxPending();

  async function withdraw(token: string, share: BigNumber) {
    if (!provider || !chainId || !account) return;
    let bentobox = new Contract(BENTOBOX_ADDR[chainId], BENTO_ABI, provider);
    bentobox = bentobox.connect(provider.getSigner());
    const tx = await bentobox.withdraw(token, account, account, 0, share);
    await setTxPending(tx.hash, 5);
    await fetchBalances();
  }

  return withdraw;
}
