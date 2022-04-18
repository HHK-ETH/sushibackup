import { Contract } from 'ethers';
import { parseUnits } from 'ethers/lib/utils';
import { UNWINDOOOR_ADDR } from '../../helpers/unwindooor';
import { WETHMAKER_ABI } from '../../imports/abis';
import { WETH } from '../../imports/tokens';
import useTxPending from '../useTxPending';
import useWeb3 from '../useWeb3';

export default function useUnwindWithdraw(recipient: string, amount: number): () => Promise<void> {
  const { chainId, provider } = useWeb3();
  const setTxPending = useTxPending();

  async function withdraw() {
    if (!chainId || !provider) return;
    const maker = new Contract(UNWINDOOOR_ADDR[chainId], WETHMAKER_ABI, provider).connect(provider.getSigner());
    const tx = await maker.withdraw(WETH[chainId], recipient, parseUnits(amount.toString(), 'ether'));
    await setTxPending(tx.hash, 3);
  }

  return withdraw;
}
