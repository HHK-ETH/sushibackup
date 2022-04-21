import { Contract } from 'ethers';
import { MASTERCHEF_ADDR } from '../../helpers/farm';
import useTxPending from '../useTxPending';
import useWeb3 from '../useWeb3';

type UnstakeParams = {
  harvest: boolean;
  contract: Contract;
  pid: string;
  amount: string;
};

export default function useUnstake(account: string | null | undefined): (params: UnstakeParams) => Promise<void> {
  const { chainId, provider } = useWeb3();
  const setTxPending = useTxPending();

  async function unstake(params: UnstakeParams) {
    const { harvest, contract, pid, amount } = params;
    if (!provider || !chainId || !account) return;
    const farm = contract.connect(provider.getSigner());
    let tx;
    if (chainId === 1 && farm.address === MASTERCHEF_ADDR) {
      tx = await farm.withdraw(pid, amount);
    } else {
      if (harvest) {
        tx = await farm.withdrawAndHarvest(pid, amount, account);
      } else {
        tx = await farm.withdraw(pid, amount, account);
      }
    }
    setTxPending(tx.hash, 3);
  }

  return unstake;
}
