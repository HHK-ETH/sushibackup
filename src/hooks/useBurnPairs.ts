import { Contract } from 'ethers';
import { parseUnits } from 'ethers/lib/utils';
import { useContext } from 'react';
import { TxPending } from '../context';
import { NETWORKS } from '../helpers/network';
import { UNWINDOOOR_ADDR } from '../helpers/unwindooor';
import { SUSHIMAKER_ABI } from '../imports/abis';
import useWeb3 from './useWeb3';

type BurnPairsParams = { pairs: any[]; shares: number[]; slippage: number };

function formatBurnParams(params: BurnPairsParams) {
  let lpTokens = [],
    amounts = [],
    minimumOut0 = [],
    minimumOut1 = [];
  for (let i in params.pairs) {
    const pair = params.pairs[i];
    const share = params.shares[i] / 100;
    lpTokens.push(pair.id);
    const amount = parseUnits((parseFloat(pair.balance) * share).toFixed(18));
    amounts.push(amount);
    const ratio = (parseFloat(pair.balance) * share) / parseFloat(pair.totalSupply);
    const amount0 = parseUnits(
      (ratio * parseFloat(pair.reserve0) * (1 - params.slippage / 100)).toFixed(6),
      pair.token0.decimals
    );
    const amount1 = parseUnits(
      (ratio * parseFloat(pair.reserve1) * (1 - params.slippage / 100)).toFixed(6),
      pair.token1.decimals
    );
    minimumOut0.push(amount0);
    minimumOut1.push(amount1);
  }
  return { lpTokens, amounts, minimumOut0, minimumOut1 };
}

export default function useBurnPairs(params: BurnPairsParams): () => Promise<void> {
  const { provider, chainId } = useWeb3();
  const { setTxPending } = useContext(TxPending);
  const { lpTokens, amounts, minimumOut0, minimumOut1 } = formatBurnParams(params);

  async function burnPairs() {
    if (!provider || !chainId) {
      return;
    }
    const sushiMaker = new Contract(UNWINDOOOR_ADDR[chainId], SUSHIMAKER_ABI, provider.getSigner());
    const gasQuantity = await sushiMaker.estimateGas.burnPairs(lpTokens, amounts, minimumOut0, minimumOut1);
    const tx = await sushiMaker.burnPairs(lpTokens, amounts, minimumOut0, minimumOut1, {
      gasLimit: gasQuantity.mul(130).div(100), //add 30% to reduce out of gas errors
    });
    setTxPending(NETWORKS[provider._network.chainId].explorer + 'tx/' + tx.hash);
    await provider.waitForTransaction(tx.hash, 5);
    setTxPending('');
  }

  return burnPairs;
}
