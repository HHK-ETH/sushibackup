import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { BigNumber, Contract, providers } from 'ethers';
import { useEffect, useState } from 'react';
import { formatUnits } from 'ethers/lib/utils';
import { NETWORKS } from '../../../helpers/network';
import Slippage from '../utils/slippage';
import { calculateBuySushiOutput, UNWINDOOOR_ADDR } from '../../../helpers/unwindooor';
import sushiMakerAbi from '../../../imports/abis/sushiMaker.json';

const BuySushi = ({ setTxPending, wethBalance }: { setTxPending: Function; wethBalance: number }): JSX.Element => {
  const context = useWeb3React<Web3Provider>();
  const { active, chainId, connector } = context;
  const [slippage, setSlippage] = useState(0.1);
  const [swapData, setSwapData] = useState({
    amountIn: BigNumber.from(0),
    minimumOut: BigNumber.from(0),
    noPriceImpactAmountOut: BigNumber.from(0),
  });
  const [share, setShare] = useState(100);
  const [error, setError] = useState('');

  const execBuySushi = async () => {
    if (!chainId || !connector) return;
    const provider = new providers.Web3Provider(await connector.getProvider(), 'any');
    const maker = new Contract(UNWINDOOOR_ADDR[chainId], sushiMakerAbi, provider).connect(provider.getSigner());
    const tx = await maker.buySushi(swapData.amountIn, swapData.minimumOut);
    setTxPending(NETWORKS[chainId].explorer + 'tx/' + tx.hash);
    await provider.waitForTransaction(tx.hash, 1);
    setTxPending('');
  };

  useEffect(() => {
    const fetchMinimumOut = async () => {
      if (!connector || !chainId) return;
      const provider = new providers.Web3Provider(await connector.getProvider(), 'any');
      const res = await calculateBuySushiOutput(chainId, provider, slippage, share);
      if (res.minimumOut.eq(0)) {
        setError('Price impact to high. Try reducing the amount of WETH to use.');
      } else {
        setError('');
      }
      setSwapData(res);
    };
    fetchMinimumOut();
  }, [active, connector, slippage, share, chainId]);

  if (!active) return <div className="text-center text-white">Please connect your wallet.</div>;

  return (
    <div className="text-center text-white">
      <Slippage setSlippage={setSlippage} slippage={slippage} />
      <div className="p-2 mt-4 text-lg border-2 border-indigo-700 rounded-lg">
        <div className="grid grid-cols-5 mb-4">
          <h3 className="col-span-2">From: {((wethBalance * share) / 100).toFixed(2)} WETH</h3>
          <h3>Share:</h3>
          <input
            className="col-span-2 text-center text-white bg-indigo-700 rounded-full inline-blockfont-medium text-md"
            type={'number'}
            value={share}
            onChange={(e) => {
              let _share = parseInt(e.target.value, 10);
              if (isNaN(_share)) _share = 100;
              if (_share > 100) _share = 100;
              if (_share < 1) _share = 1;
              setShare(_share);
            }}
          />
        </div>
        <div className="mb-4 ">
          <h3>Receive:</h3>
          <h3 className="col-span-3">
            {parseFloat(formatUnits(swapData.minimumOut)).toFixed(4) +
              ' (' +
              (
                (parseFloat(formatUnits(swapData.minimumOut)) /
                  parseFloat(formatUnits(swapData.noPriceImpactAmountOut)) -
                  1) *
                100
              ).toFixed(2) +
              '%) SUSHI'}
          </h3>
        </div>
      </div>
      <button
        className={'px-16 text-lg font-medium text-white bg-pink-500 rounded hover:bg-pink-600'}
        onClick={() => execBuySushi()}
      >
        Execute
      </button>
      <div className="mt-4 font-semibold">{error}</div>
    </div>
  );
};

export default BuySushi;
