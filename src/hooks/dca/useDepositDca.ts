import { Contract } from 'ethers';
import { parseUnits } from 'ethers/lib/utils';
import { BENTOBOX_ADDR } from '../../helpers/bentobox';
import { BENTO_ABI } from '../../imports/abis';
import useTxPending from '../useTxPending';
import useWeb3 from '../useWeb3';

type DepositDcaParams = {
  account: string | null | undefined;
  vault: any;
  fromWallet: boolean;
  amount: number;
  fetchVaults: () => Promise<void>;
};

export default function useDepositDca(params: DepositDcaParams): () => Promise<void> {
  const { provider, chainId } = useWeb3();
  const setTxPending = useTxPending();
  const { account, vault, fromWallet, amount, fetchVaults } = params;

  async function depositDCA() {
    if (!provider || !account || !chainId || vault === null) {
      return;
    }
    const bento = new Contract(BENTOBOX_ADDR[chainId], BENTO_ABI, provider.getSigner());
    const parsedAmount = parseUnits(amount.toString(), vault.sellToken.decimals);
    const shares = await bento.toShare(vault.sellToken.id, parsedAmount, false);
    let tx;
    if (fromWallet) {
      tx = await bento.deposit(vault.sellToken.id, account, vault.id, parsedAmount, 0);
    } else {
      tx = await bento.transfer(vault.sellToken.id, account, vault.id, shares);
    }
    await setTxPending(tx.hash, 5);
    await fetchVaults();
  }

  return depositDCA;
}
