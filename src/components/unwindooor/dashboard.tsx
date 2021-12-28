import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { BigNumber, Contract, providers } from 'ethers';
import { formatUnits } from 'ethers/lib/utils';
import { useEffect, useState } from 'react';
import { PRODUCTS, PRODUCT_IDS } from '../../helpers/products';
import { WETH } from '../../imports/tokens';
import erc20Abi from './../../imports/abis/erc20.json';

const Dashboard = ({
  totalFees,
  setOpenModal,
  setTxPending,
  setParams,
}: {
  totalFees: number;
  setOpenModal: Function;
  setTxPending: Function;
  setParams: Function;
}): JSX.Element => {
  const context = useWeb3React<Web3Provider>();
  const { active, chainId, connector } = context;
  const [wethBalance, setWethBalance] = useState(BigNumber.from(0));

  useEffect(() => {
    const fetchWethBalance = async () => {
      if (!connector || !chainId) return;
      const provider = new providers.Web3Provider(await connector.getProvider(), 'any');
      const weth = new Contract(WETH[chainId], erc20Abi, provider);
      const balance = await weth.balanceOf(PRODUCTS[PRODUCT_IDS.UNWINDOOOR].networks[chainId]);
      setWethBalance(balance);
    };
    fetchWethBalance();
  }, [active, chainId, connector]);

  return (
    <div className="p-16 py-8 bg-indigo-900 rounded-xl">
      <div className="grid grid-cols-4 gap-8 mb-4">
        <h1 className="text-xl text-left">Total WETH available: {parseFloat(formatUnits(wethBalance)).toFixed(2)}</h1>
        <button
          className="px-16 text-lg font-medium text-white bg-pink-500 rounded hover:bg-pink-600"
          onClick={() => setOpenModal('buyWeth')}
        >
          Buy WETH
        </button>
        <button
          className="px-16 text-lg font-medium text-white bg-pink-500 rounded hover:bg-pink-600"
          onClick={() => {
            if (chainId === 1) {
              setParams({
                setTxPending: setTxPending,
                wethBalance: parseFloat(formatUnits(wethBalance)),
              });
              setOpenModal('buySushi');
            } else {
              setParams({
                setTxPending: setTxPending,
                wethBalance: parseFloat(formatUnits(wethBalance)),
              });
              setOpenModal('withdraw');
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
          Total fees available to unwind: {totalFees.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}$
        </h1>
      </div>
    </div>
  );
};

export default Dashboard;
