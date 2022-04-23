import { BigNumber, Contract } from 'ethers';
import { AbiCoder, parseUnits } from 'ethers/lib/utils';
import { useCallback } from 'react';
import { TRIDENT_ROUTER_ADDRESSES } from '../../helpers/trident';
import { TRIDENT_ABI } from '../../imports/abis';
import useTxPending from '../useTxPending';
import useWeb3 from '../useWeb3';

export default function useRemoveLiquidityTrident(
  account: string | null | undefined,
  position: any,
  minimumOut: { token0: BigNumber; token1: BigNumber },
  fetchMinimumOutCPP: () => Promise<void>
): () => Promise<void> {
  const { chainId, provider } = useWeb3();
  const setTxPending = useTxPending();

  const removeLiquidity = useCallback(async () => {
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
          amount: minimumOut.token0,
        },
        {
          token: position.pool.assets[1].token.id,
          amount: minimumOut.token1,
        },
      ]
    );
    await setTxPending(tx.hash, 5);
    await fetchMinimumOutCPP();
  }, [
    account,
    chainId,
    minimumOut.token0,
    minimumOut.token1,
    position.balance,
    position.pool.assets,
    position.pool.id,
    provider,
    setTxPending,
    fetchMinimumOutCPP,
  ]);

  return removeLiquidity;
}
