import { Contract } from 'ethers';
import { UNWINDOOOR_ADDR } from '../helpers/unwindooor';
import { WETHMAKER_ABI } from '../imports/abis';
import useTxPending from './useTxPending';
import useWeb3 from './useWeb3';

export default function useBuyWeth(selectedTokens: any[], outputs: any[]): () => Promise<void> {
  const { provider, chainId } = useWeb3();
  const setTxPending = useTxPending();

  async function buyWeth() {
    if (!chainId || !provider) return;
    const maker = new Contract(UNWINDOOOR_ADDR[chainId], WETHMAKER_ABI, provider).connect(provider.getSigner());
    const tokens = selectedTokens.map((token) => {
      return token.address;
    });
    const amounts = outputs.map((output: any) => {
      return output.amountIn;
    });
    const minimumOuts = outputs.map((output: any) => {
      return output.minimumOut;
    });

    const gasQuantity = await maker.estimateGas.buyWeth(tokens, amounts, minimumOuts);
    const tx = await maker.buyWeth(tokens, amounts, minimumOuts, { gasLimit: gasQuantity.mul(130).div(100) }); //increase gas limit by 30% to reduce out of gas errors
    await setTxPending(tx.hash, 3);
  }

  return buyWeth;
}
