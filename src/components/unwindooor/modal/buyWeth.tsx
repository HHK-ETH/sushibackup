import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { BigNumber, Contract, providers } from 'ethers';
import { useEffect, useState } from 'react';
import { formatUnits } from 'ethers/lib/utils';
import wethMakerABI from '../../../imports/abis/wethMaker.json';
import { NETWORKS } from '../../../helpers/network';
import Slippage from '../utils/slippage';
import { calculateBuyWethOutput, UNWINDOOOR_ADDR } from '../../../helpers/unwindooor';

const BuyWeth = ({ setTxPending, selectedTokens }: { setTxPending: Function; selectedTokens: any[] }): JSX.Element => {
  const context = useWeb3React<Web3Provider>();
  const { active, chainId, connector } = context;
  const [slippage, setSlippage] = useState(0.1);
  const [shares, setShares] = useState(
    selectedTokens.map((token) => {
      return BigNumber.from(100);
    })
  );
  const [outputs, setOutputs]: [outputs: any, setOutputs: Function] = useState([]);
  const [error, setError] = useState('');

  const execBuyWeth = async () => {
    if (!chainId || !connector) return;
    const provider = new providers.Web3Provider(await connector.getProvider(), 'any');
    const maker = new Contract(UNWINDOOOR_ADDR[chainId], wethMakerABI, provider).connect(provider.getSigner());
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
    setTxPending(NETWORKS[chainId].explorer + 'tx/' + tx.hash);
    await provider.waitForTransaction(tx.hash, 1);
    setTxPending('');
  };

  useEffect(() => {
    const fetchOutputs = async () => {
      if (!connector || !chainId) return;
      const provider = new providers.Web3Provider(await connector.getProvider(), 'any');
      const res = await calculateBuyWethOutput(chainId, provider, slippage, selectedTokens, shares);
      if (
        res.find((e) => {
          return e.minimumOut.eq(0);
        })
      ) {
        setError('Price impact to high or Unknown token.');
      } else {
        setError('');
      }
      setOutputs(res);
    };
    fetchOutputs();
  }, [active, chainId, connector, selectedTokens, slippage, shares]);

  if (!active) return <div className="text-center text-white">Please connect your wallet.</div>;

  return (
    <div className="text-center text-white">
      <Slippage setSlippage={setSlippage} slippage={slippage} />
      {selectedTokens.map((token, index) => {
        const output = outputs[index];
        const minimumOut = output ? parseFloat(formatUnits(output.minimumOut, output.decimals)) : 0;
        const noPriceImpactAmountOut = output
          ? parseFloat(formatUnits(output.noPriceImpactAmountOut, output.decimals))
          : 0;
        return (
          <div key={index} className="p-2 mt-4 border-2 border-indigo-700 rounded-lg text-md">
            <div className="grid grid-cols-6 mb-4">
              <h3>From:</h3>
              <h3 className="col-span-5">{token.symbol}</h3>
            </div>
            <div className="grid grid-cols-6 mb-4">
              <h3>Share:</h3>
              <input
                className="w-16 font-medium text-center text-white bg-indigo-700 rounded-full"
                type={'number'}
                value={shares[index].toNumber()}
                onChange={(e) => {
                  const _shares = [...shares];
                  let share = parseInt(e.target.value, 10);
                  if (isNaN(share)) share = 100;
                  if (share > 100) share = 100;
                  if (share < 1) share = 1;
                  _shares[index] = BigNumber.from(share);
                  setShares(_shares);
                }}
              />
              <h3>Receive:</h3>
              <h3 className="col-span-3">
                {output
                  ? minimumOut.toFixed(4) +
                    ' (' +
                    ((minimumOut / noPriceImpactAmountOut - 1) * 100).toFixed(2) +
                    '%) ' +
                    output.symbol
                  : 'Loading...'}
              </h3>
            </div>
          </div>
        );
      })}
      <button
        className={'px-16 text-lg font-medium text-white bg-pink-500 rounded hover:bg-pink-600'}
        onClick={() => execBuyWeth()}
      >
        Execute
      </button>
      <div className="mt-4 font-semibold">{error}</div>
    </div>
  );
};

export default BuyWeth;
