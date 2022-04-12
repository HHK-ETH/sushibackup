import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { useContext, useEffect, useState } from 'react';
import Dashboard from './dashboard';
import { UNWINDOOOR_ADDR, queryUnwindooorPositions } from './../../helpers/unwindooor';
import { Tab } from '@headlessui/react';
import Pairs from './Pairs';
import Tokens from './Tokens';
import { TxPending } from '../../context';
import Modal from '../general/Modal';
import UnwindPairs from './UnwindPairs';
import BuyWeth from './buyWeth';
import BuySushi from './buySushi';
import Withdraw from './withdraw';
import { BigNumber, Contract, providers } from 'ethers';
import { WETH } from '../../imports/tokens';
import erc20Abi from '../../imports/abis/erc20.json';
import { formatUnits } from 'ethers/lib/utils';

const Unwindooor = (): JSX.Element => {
  const context = useWeb3React<Web3Provider>();
  const { active, chainId, connector } = context;
  const { setTxPending } = useContext(TxPending);
  const [selectedPairs, setSelectedPairs]: [any[], Function] = useState([]);
  const [modalContent, setModalContent]: [string, Function] = useState('');
  const [open, setOpen]: [boolean, Function] = useState(false);
  const [wethBalance, setWethBalance] = useState(BigNumber.from(0));
  const [loading, setLoading] = useState(false);
  const [data, setData]: [data: any, setData: Function] = useState({
    totalFees: 0,
    positions: [],
  });
  const [pairTab, setPairTab] = useState(true);

  useEffect(() => {
    const fetchPositions = async () => {
      if (!active || !chainId || !UNWINDOOOR_ADDR[chainId] || !connector) return;
      setLoading(true);
      setData(await queryUnwindooorPositions(chainId));
      const provider = new providers.Web3Provider(await connector.getProvider(), 'any');
      const weth = new Contract(WETH[chainId], erc20Abi, provider);
      const balance = await weth.balanceOf(UNWINDOOOR_ADDR[chainId]);
      setWethBalance(balance);
      setLoading(false);
    };
    fetchPositions();
  }, [active, chainId, connector]);

  if (chainId && !UNWINDOOOR_ADDR[chainId]) {
    return <div className={'mt-24 text-xl text-center text-white'}>Unwindooor is not available on this network.</div>;
  }
  if (loading) return <div className="container p-16 mx-auto text-center text-white">Loading data...</div>;
  if (!active) return <div className="container p-16 mx-auto text-center text-white">Please connect your wallet.</div>;

  return (
    <>
      <Modal open={open} setOpen={setOpen}>
        {modalContent === 'unwind' && <UnwindPairs pairs={selectedPairs} setTxPending={setTxPending} />}
        {modalContent === 'buyWeth' && <BuyWeth setTxPending={setTxPending} />}
        {modalContent === 'buySushi' && (
          <BuySushi setTxPending={setTxPending} wethBalance={parseFloat(formatUnits(wethBalance))} />
        )}
        {modalContent === 'withdraw' && (
          <Withdraw setTxPending={setTxPending} wethBalance={parseFloat(formatUnits(wethBalance))} />
        )}
      </Modal>
      <div className="container p-16 mx-auto text-center text-white">
        <Dashboard
          totalFees={data.totalFees}
          wethBalance={wethBalance}
          setModalContent={setModalContent}
          setOpen={setOpen}
        />
        <Tab.Group>
          <Tab.List className={'grid grid-cols-2'}>
            <button onClick={() => setPairTab(true)}>
              <Tab
                className={
                  pairTab
                    ? 'w-full py-2 rounded-tl-xl bg-indigo-600'
                    : 'w-full py-2 rounded-tl-xl bg-indigo-700 hover:bg-indigo-500'
                }
              >
                Pairs
              </Tab>
            </button>
            <button onClick={() => setPairTab(false)}>
              <Tab
                className={
                  !pairTab
                    ? 'w-full py-2 rounded-tr-xl bg-indigo-600'
                    : 'w-full py-2 rounded-tr-xl bg-indigo-700 hover:bg-indigo-500'
                }
              >
                Tokens
              </Tab>
            </button>
          </Tab.List>
          <Tab.Panels>
            <Tab.Panel>
              <Pairs selectedPairs={selectedPairs} setSelectedPairs={setSelectedPairs} positions={data.positions} />
            </Tab.Panel>
            <Tab.Panel>
              <Tokens />
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
        {selectedPairs.length > 0 && (
          <div className="absolute right-6 bottom-6">
            <button
              className="px-16 text-lg font-medium text-white bg-pink-500 rounded hover:bg-pink-600"
              onClick={() => {
                setModalContent('unwind');
                setOpen(true);
              }}
            >
              Unwind!
            </button>
            <button
              className="px-20 ml-2 text-lg font-medium text-white bg-pink-500 rounded hover:bg-pink-600"
              onClick={() => {
                setModalContent('burn');
                setOpen(true);
              }}
            >
              Burn!
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Unwindooor;
