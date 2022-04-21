import { Contract } from 'ethers';
import { AbiCoder, parseUnits } from 'ethers/lib/utils';
import { TRIDENT_ROUTER_ADDRESSES } from '../../helpers/trident';
import { TRIDENT_ABI } from '../../imports/abis';
import useTxPending from '../useTxPending';
import useWeb3 from '../useWeb3';

export default function useRemoveLiquidityTrident(
  account: string | null | undefined,
  position: any,
  tokensToBeReceived: number[]
): () => Promise<void> {
  const { chainId, provider } = useWeb3();
  const setTxPending = useTxPending();

  async function removeLiquidity() {
    if (!provider || !account || !chainId) {
      return;
    }
    const tridentContract = new Contract(TRIDENT_ROUTER_ADDRESSES[chainId], TRIDENT_ABI, provider).connect(
      provider.getSigner()
    );
    const tx = await tridentContract.burnLiquidity(
      position.pool.id,
      parseUnits(position.balance, 18),
      new AbiCoder().encode(['address', 'bool'], [account, true]),
      [
        {
          token: position.pool.assets[0].token.id,
          amount: parseUnits(tokensToBeReceived[0].toFixed(18), position.pool.assets[0].token.decimals),
        },
        {
          token: position.pool.assets[1].token.id,
          amount: parseUnits(tokensToBeReceived[1].toFixed(18), position.pool.assets[1].token.decimals),
        },
      ]
    );
    setTxPending(tx.hash, 3);
  }

  return removeLiquidity;
}
