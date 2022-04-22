import { Contract } from 'ethers';
import { parseUnits } from 'ethers/lib/utils';
import { BENTOBOX_ADDR } from '../../helpers/bentobox';
import { BENTO_ABI, DCA_ABI } from '../../imports/abis';
import useTxPending from '../useTxPending';
import useWeb3 from '../useWeb3';

export default function useWithdrawDca(
  amount: number,
  vault: any,
  fetchVaults: () => Promise<void>
): () => Promise<void> {
  const { provider, chainId } = useWeb3();
  const setTxPending = useTxPending();

  const withdraw = async () => {
    if (!provider || !chainId || vault === null) {
      return;
    }
    const bento = new Contract(BENTOBOX_ADDR[chainId], BENTO_ABI, provider.getSigner());
    const dca = new Contract(vault.id, DCA_ABI, provider.getSigner());
    const parsedAmount = parseUnits(amount.toString(), vault.sellToken.decimals);
    const shares = await bento.toShare(vault.sellToken.id, parsedAmount, false);
    const tx = await dca.withdraw(shares);
    await setTxPending(tx.hash, 5);
    await fetchVaults();
  };

  return withdraw;
}
