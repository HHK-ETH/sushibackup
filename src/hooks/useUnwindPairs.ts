import { Contract } from 'ethers';
import { UNWINDOOOR_ADDR } from '../helpers/unwindooor';
import { SUSHIMAKER_ABI } from '../imports/abis';
import useTxPending from './useTxPending';
import useWeb3 from './useWeb3';

export default function useUnwindPairs(pairs: any[], outputs: any[]): () => Promise<void> {
  const { chainId, provider } = useWeb3();
  const setTxPending = useTxPending();

  async function unwindPairs() {
    if (!chainId || !provider) return;
    const maker = new Contract(UNWINDOOOR_ADDR[chainId], SUSHIMAKER_ABI, provider).connect(provider.getSigner());
    let tokensA: any[] = [];
    let tokensB: any[] = [];
    pairs.forEach((pair: any, index: number) => {
      if (outputs[index].keepToken0) {
        tokensA.push(pair.token0.id);
        tokensB.push(pair.token1.id);
      } else {
        tokensA.push(pair.token1.id);
        tokensB.push(pair.token0.id);
      }
    });
    const amounts = outputs.map((output) => {
      return output.amount;
    });
    const minimumOuts = outputs.map((output) => {
      return output.minimumOut;
    });
    const gasQuantity = await maker.estimateGas.unwindPairs(tokensA, tokensB, amounts, minimumOuts);
    const tx = await maker.unwindPairs(tokensA, tokensB, amounts, minimumOuts, {
      gasLimit: gasQuantity.mul(130).div(100), //increase gas limit by 30% to reduce out of gas errors
    });
    await setTxPending(tx.hash, 3);
  }

  return unwindPairs;
}
