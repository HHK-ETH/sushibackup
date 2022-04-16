import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { useState } from 'react';
import useBurnPairs from '../../../hooks/useBurnPairs';
import Slippage from '../utils/slippage';

const BurnPairs = ({ pairs }: { pairs: any[] }): JSX.Element => {
  const [slippage, setSlippage]: [slippage: number, setSlippage: Function] = useState(0.1);
  const context = useWeb3React<Web3Provider>();
  const { connector } = context;
  const [shares, setShares] = useState(
    pairs.map((pair) => {
      return 100;
    })
  );
  const burnPairs = useBurnPairs({ pairs, shares, slippage });

  if (!connector) {
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
          const share = shares[index] / 100;
          const ratio = (parseFloat(pair.balance) * share) / parseFloat(pair.totalSupply);
          const amount0 = ratio * parseFloat(pair.reserve0) * (1 - slippage / 100);
          const amount1 = ratio * parseFloat(pair.reserve1) * (1 - slippage / 100);
          return (
            <div key={index} className="grid grid-cols-6 gap-1 px-4 pb-2 bg-indigo-800 rounded-b-xl">
              <div>{pair.token0.symbol}</div>
              <div>{pair.token1.symbol}</div>
              <div>
                <input
                  className="w-16 pr-1 font-medium text-right text-white bg-indigo-700 rounded-full text-md"
                  type={'number'}
                  value={shares[index]}
                  onChange={(e) => {
                    let _share = parseFloat(e.target.value);
                    if (isNaN(_share)) _share = 100;
                    if (_share > 100) _share = 100;
                    if (_share < 1) _share = 1;
                    let _shares = [...shares];
                    _shares[index] = _share;
                    setShares(_shares);
                  }}
                />
              </div>
              <div className="col-span-3 text-sm">
                {amount0.toFixed(2)} {pair.token0.symbol} - {amount1.toFixed(2)} {pair.token1.symbol}
              </div>
            </div>
          );
        })}
        <button
          className="px-8 py-2 text-white bg-pink-500 rounded-b-lg hover:bg-pink-600 text-md"
          onClick={() => burnPairs()}
        >
          Burn
        </button>
      </div>
    </>
  );
};

export default BurnPairs;
