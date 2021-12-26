import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { BigNumber, Contract, providers } from 'ethers';
import { formatUnits, getAddress } from 'ethers/lib/utils';
import { useEffect, useState } from 'react';
import { WethMaker } from 'unwindooor-sdk';
import { NETWORKS } from '../../helpers/network';
import { PRODUCTS, PRODUCT_IDS } from '../../helpers/products';
import { WETH } from '../../imports/tokens';

const UnwindPairs = ({ pairs, setTxPending }: { pairs: any[]; setTxPending: Function }): JSX.Element => {
  const [slippage, setSlippage]: [slippage: number, setSlippage: Function] = useState(0.1);
  const context = useWeb3React<Web3Provider>();
  const { active, chainId, connector } = context;
  const [unwindData, setUnwindData]: [unwindData: any[], setUnwindData: Function] = useState(
    pairs.map((pair: any) => {
      const prefToken = pair.token1.symbol === 'WETH' ? pair.token1.id : pair.token0.id;
      return {
        prefToken: prefToken,
        share: 100,
      };
    })
  );
  const [outputs, setOutputs]: [priceImpacts: any[], setPriceImpacts: Function] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!connector) return;
      const provider = new providers.Web3Provider(await connector.getProvider(), 'any');
      const tempPriceImpacts = await Promise.all(
        unwindData.map(async (data, index) => {
          const wethMaker = new WethMaker({
            wethMakerAddress: chainId
              ? PRODUCTS[PRODUCT_IDS.UNWINDOOOR].networks[chainId]
              : PRODUCTS[PRODUCT_IDS.UNWINDOOOR].networks[1],
            preferTokens: [getAddress(data.prefToken)],
            provider: provider,
            maxPriceImpact: BigNumber.from(60),
            priceSlippage: BigNumber.from(slippage * 10),
            wethAddress: chainId ? WETH[chainId] : WETH[1],
            sushiAddress: '0x6b3595068778dd592e39a122f4f5a5cf09c90fe2',
            factoryAddress: chainId
              ? PRODUCTS[PRODUCT_IDS.SUSHI_MAKER].networks[chainId]
              : PRODUCTS[PRODUCT_IDS.SUSHI_MAKER].networks[1],
          });
          const { amount, minimumOut, keepToken0 } = await wethMaker.unwindPair(
            pairs[index].id,
            BigNumber.from(data.share)
          );
          const { reserve0, reserve1, totalSupply } = await wethMaker._getUnwindData(pairs[index].id);
          const noPiAmountOut = keepToken0
            ? amount.mul(reserve0).div(totalSupply).mul(2)
            : amount.mul(reserve1).div(totalSupply).mul(2);
          return { amount: amount, minimumOut: minimumOut, noPiAmountOut: noPiAmountOut };
        })
      );
      setOutputs(tempPriceImpacts);
    };
    fetchData();
  }, [unwindData, slippage, connector, chainId]);

  if (!active) {
    return <div className="text-white">Please connect your wallet first.</div>;
  }

  return (
    <>
      <div className="text-center text-white">
        <div className="grid grid-cols-4 gap-4">
          <p>Max slippage:</p>
          {[0.1, 0.5, 1].map((value) => {
            return (
              <button
                className={
                  slippage === value
                    ? 'text-lg font-medium text-white rounded-full bg-purple-700'
                    : 'text-lg font-medium text-white rounded-full bg-pink-500 hover:bg-pink-600'
                }
                onClick={() => {
                  setSlippage(value);
                }}
              >
                {value}%
              </button>
            );
          })}
        </div>
        <div className="grid grid-cols-6 gap-1 p-2 px-4 mt-4 bg-indigo-800 rounded-t-xl">
          <div>Token 0</div>
          <div>Token 1</div>
          <div>Share</div>
          <div className="col-span-3">Receive</div>
        </div>
        {pairs.map((pair: any, index: number) => {
          const data: any = unwindData[index];
          const prefToken: any = data.prefToken === pair.token0.id ? pair.token0 : pair.token1;
          const minimumOut = parseFloat(
            formatUnits(outputs[index] ? outputs[index].minimumOut : 0, prefToken.decimals)
          );
          const noPiAmountOut = parseFloat(
            formatUnits(outputs[index] ? outputs[index].noPiAmountOut : 0, prefToken.decimals)
          );
          const priceImpact = ((minimumOut / noPiAmountOut - 1) * 100).toFixed(2);
          return (
            <div key={index} className="grid grid-cols-6 gap-1 px-4 pb-2 bg-indigo-800 rounded-b-xl">
              <button
                className={
                  data.prefToken === pair.token0.id
                    ? 'text-md font-medium text-white rounded-full bg-purple-700'
                    : 'text-md font-medium text-white rounded-full bg-pink-500 hover:bg-pink-600'
                }
                onClick={() => {
                  const tempData = [...unwindData];
                  tempData[index].prefToken = pair.token0.id;
                  setUnwindData(tempData);
                }}
              >
                {pair.token0.symbol}
              </button>
              <button
                className={
                  data.prefToken === pair.token1.id
                    ? 'text-md font-medium text-white rounded-full bg-purple-700'
                    : 'text-md font-medium text-white rounded-full bg-pink-500 hover:bg-pink-600'
                }
                onClick={() => {
                  const tempData = [...unwindData];
                  tempData[index].prefToken = pair.token1.id;
                  setUnwindData(tempData);
                }}
              >
                {pair.token1.symbol}
              </button>
              <div>
                <input
                  className="w-16 pr-1 font-medium text-right text-white bg-indigo-700 rounded-full text-md"
                  type={'number'}
                  value={data.share}
                  onChange={(e) => {
                    const tempData = [...unwindData];
                    let share = parseInt(e.target.value, 10);
                    if (isNaN(share)) share = 100;
                    if (share > 100) share = 100;
                    if (share < 1) share = 1;
                    tempData[index].share = share;
                    setUnwindData(tempData);
                  }}
                />
              </div>
              <div className="col-span-3 text-sm">
                {outputs[index] ? minimumOut.toFixed(4) + ' (' + priceImpact + '%) ' + prefToken.symbol : 'loading...'}
              </div>
            </div>
          );
        })}
        <button
          className="px-8 py-2 text-white bg-pink-500 rounded-b-lg hover:bg-pink-600 text-md"
          onClick={() => {
            const execUnwindPairs = async () => {
              if (!chainId || !connector) return;
              const provider = new providers.Web3Provider(await connector.getProvider(), 'any');
              const maker = new Contract(
                PRODUCTS[PRODUCT_IDS.UNWINDOOOR].networks[chainId],
                PRODUCTS[PRODUCT_IDS.UNWINDOOOR].ABI,
                provider
              ).connect(provider.getSigner());
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
              const tx = await maker.unwindPairs(tokensA, tokensB, amounts, minimumOuts);
              setTxPending(NETWORKS[chainId].explorer + 'tx/' + tx.hash);
              await provider.waitForTransaction(tx.hash, 1);
              setTxPending('');
            };
            execUnwindPairs();
          }}
        >
          Execute
        </button>
      </div>
    </>
  );
};

export default UnwindPairs;
