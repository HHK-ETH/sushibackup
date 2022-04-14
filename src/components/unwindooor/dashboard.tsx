import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { BigNumber } from 'ethers';
import { formatUnits } from 'ethers/lib/utils';

const Dashboard = ({
  totalFees,
  setModalContent,
  setOpen,
  wethBalance,
}: {
  totalFees: number;
  setModalContent: Function;
  setOpen: Function;
  wethBalance: BigNumber;
}): JSX.Element => {
  const context = useWeb3React<Web3Provider>();
  const { chainId } = context;
  return (
    <div className="p-16 py-8 mb-4 bg-indigo-900 rounded-xl">
      <div className="grid grid-cols-4 gap-8 mb-4">
        <h1 className="text-xl text-left">Total WETH available: {parseFloat(formatUnits(wethBalance)).toFixed(2)}</h1>
        <button
          className="px-16 text-lg font-medium text-white bg-pink-500 rounded hover:bg-pink-600"
          onClick={() => {
            setModalContent('buyWeth');
            setOpen(true);
          }}
        >
          Buy WETH
        </button>
        <button
          className="px-16 text-lg font-medium text-white bg-pink-500 rounded hover:bg-pink-600"
          onClick={() => {
            if (chainId === 1) {
              setModalContent('buySushi');
              setOpen(true);
            } else {
              setModalContent('withdraw');
              setOpen(true);
            }
          }}
        >
          {chainId === 1 ? 'Buy Sushi' : 'Transfer WETH'}
        </button>
        <button
          className="px-16 text-lg font-medium text-white bg-gray-400 rounded hover:bg-gray-500"
          onClick={() => {}}
        >
          {chainId === 1 ? 'Sweep' : 'Bridge WETH'}
        </button>
      </div>
      <div className="">
        <h1 className="text-xl text-left">
          Total fees available (pairs + tokens): {totalFees.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}$
        </h1>
      </div>
    </div>
  );
};

export default Dashboard;
