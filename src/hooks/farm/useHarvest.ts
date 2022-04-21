import { Contract } from 'ethers';
import { MASTERCHEF_ADDR } from '../../helpers/farm';
import useTxPending from '../useTxPending';
import useWeb3 from '../useWeb3';

type HarvestParams = {
  contract: Contract;
  pid: string;
};

export default function useHarvest(account: string | null | undefined): (params: HarvestParams) => Promise<void> {
  const { chainId, provider } = useWeb3();
  const setTxPending = useTxPending();

  async function harvest(params: HarvestParams) {
    const { contract, pid } = params;
    if (!provider || !chainId || !account) return;
    const farm = contract.connect(provider.getSigner());
    let tx;
    if (chainId === 1 && contract.address === MASTERCHEF_ADDR) {
      tx = await farm.deposit(pid, 0);
    } else {
      tx = await farm.harvest(pid, account);
    }
    setTxPending(tx.hash, 3);
  }

  return harvest;
}
