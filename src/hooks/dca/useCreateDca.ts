import { Contract } from 'ethers';
import { parseUnits } from 'ethers/lib/utils';
import { DCA_FACTORY } from '../../helpers/dca';
import { DCA_FACTORY_ABI } from '../../imports/abis';
import useTxPending from '../useTxPending';
import useWeb3 from '../useWeb3';

export default function useCreateDca(
  dcaData: any,
  account: string | null | undefined,
  fetchVaults: () => Promise<void>
): () => Promise<void> {
  const { chainId, provider } = useWeb3();
  const setTxPending = useTxPending();

  async function createDCA(): Promise<void> {
    if (!provider || !chainId) return;
    const factory = new Contract(DCA_FACTORY[chainId], DCA_FACTORY_ABI, provider.getSigner());
    const frequency = dcaData.frequency * 3600 * 24;
    const amount = parseUnits(dcaData.amount.toString(), dcaData.sellToken.decimals);
    const tx = await factory.createDCA(
      account,
      dcaData.sellToken.address,
      dcaData.buyToken.address,
      dcaData.sellToken.priceFeed,
      dcaData.buyToken.priceFeed,
      frequency,
      dcaData.buyToken.decimals - dcaData.sellToken.decimals,
      amount
    );
    await setTxPending(tx.hash, 10);
    await fetchVaults();
  }

  return createDCA;
}
