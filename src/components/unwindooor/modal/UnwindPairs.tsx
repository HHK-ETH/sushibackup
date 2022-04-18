import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { formatUnits } from 'ethers/lib/utils';
import { useState } from 'react';
import useFetchUnwindOut from '../../../hooks/unwind/useFetchUnwindOut';
import useUnwindPairs from '../../../hooks/unwind/useUnwindPairs';
import Slippage from '../utils/slippage';

const UnwindPairs = ({ pairs }: { pairs: any[] }): JSX.Element => {
  const context = useWeb3React<Web3Provider>();
  const { active } = context;
  const [slippage, setSlippage]: [slippage: number, setSlippage: Function] = useState(0.1);
  const [unwindData, setUnwindData]: [unwindData: any[], setUnwindData: Function] = useState(
    pairs.map((pair: any) => {
      const prefToken = pair.token1.symbol === 'WETH' ? pair.token1.id : pair.token0.id;
      return {
        prefToken: prefToken,
        share: 100,
      };
    })
  );
  const { outputs, loading, error } = useFetchUnwindOut({ unwindData, pairs, slippage });
  const unwindPairs = useUnwindPairs(pairs, outputs);

  if (!active) {
    return <div className="text-white">Please connect your wallet first.</div>;
  }

  return (
    <>
      <div className="text-center text-white">
        <Slippage setSlippage={setSlippage} slippage={slippage} />
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
                {loading
                  ? 'loading...'
                  : outputs[index]
                  ? minimumOut.toFixed(4) + ' (' + priceImpact + '%) ' + prefToken.symbol
                  : 'loading...'}
              </div>
            </div>
          );
        })}
        <button
          className="px-8 py-2 text-white bg-pink-500 rounded-b-lg hover:bg-pink-600 text-md"
          onClick={() => unwindPairs()}
        >
          Execute
        </button>
        <div className="mt-4 font-semibold">{error}</div>
      </div>
    </>
  );
};

export default UnwindPairs;
