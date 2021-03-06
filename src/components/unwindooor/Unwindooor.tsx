import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { useState } from 'react';
import Dashboard from './dashboard';
import { UNWINDOOOR_ADDR } from './../../helpers/unwindooor';
import { Tab } from '@headlessui/react';
import Pairs from './Pairs';
import Tokens from './Tokens';
import Modal from '../general/Modal';
import UnwindPairs from './modal/UnwindPairs';
import BuyWeth from './modal/buyWeth';
import BuySushi from './modal/buySushi';
import Withdraw from './modal/withdraw';
import { formatUnits } from 'ethers/lib/utils';
import BurnPairs from './modal/BurnPairs';
import SetBridge from './modal/Setbridge';
import useFetchUnwindData from '../../hooks/unwind/useFetchUnwindData';
import TransferPairs from './modal/TransferPairs';
import zapper from './../../imports/images/products/zapper.svg';

const Unwindooor = (): JSX.Element => {
  const context = useWeb3React<Web3Provider>();
  const { active, chainId, account } = context;
  const [selectedPairs, setSelectedPairs]: [any[], Function] = useState([]);
  const [modalContent, setModalContent]: [string, Function] = useState('');
  const [open, setOpen]: [boolean, Function] = useState(false);
  const [pairTab, setPairTab] = useState(true);
  const [selectedTokens, setSelectedTokens]: [selectedTokens: any[], setSelectedTokens: Function] = useState([]);
  const {
    data: { positions, tokens, wethBalance, isOwner, isTrusted },
    loading,
  } = useFetchUnwindData(account);

  if (chainId && !UNWINDOOOR_ADDR[chainId]) {
    return <div className={'mt-24 text-xl text-center text-white'}>Unwindooor is not available on this network.</div>;
  }
  if (loading)
    return (
      <div className="container p-16 mx-auto text-center text-white">
        Loading data...{' '}
        <div className="absolute bottom-0 left-0">
          <img src={zapper} alt="zapper" width={'200px'} />
        </div>
      </div>
    );
  if (!active) return <div className="container p-16 mx-auto text-center text-white">Please connect your wallet.</div>;

  return (
    <>
      {isTrusted && (
        <Modal open={open} setOpen={setOpen}>
          {modalContent === 'unwind' && <UnwindPairs pairs={selectedPairs} />}
          {modalContent === 'burn' && <BurnPairs pairs={selectedPairs} />}
          {modalContent === 'buyWeth' && <BuyWeth selectedTokens={selectedTokens} />}
          {modalContent === 'buySushi' && <BuySushi wethBalance={parseFloat(formatUnits(wethBalance))} />}
          {modalContent === 'withdraw' && (
            <Withdraw wethBalance={parseFloat(formatUnits(wethBalance))} isOwner={isOwner} />
          )}
          {modalContent === 'setBridge' && <SetBridge isOwner={isOwner} />}
          {modalContent === 'transfer' && <TransferPairs />}
        </Modal>
      )}
      {!isTrusted && (
        <Modal open={open} setOpen={setOpen}>
          {modalContent === 'transfer' && <TransferPairs />}
        </Modal>
      )}
      <div className="container p-16 mx-auto text-center text-white">
        {!isTrusted && (
          <div className="py-4 mb-4 text-xl font-semibold bg-indigo-900 rounded-xl">
            This page is read-only, only owner and trusted addresses can interact with this contract.
          </div>
        )}
        <Dashboard
          totalFees={positions.totalFees + tokens.total}
          wethBalance={wethBalance}
          setModalContent={setModalContent}
          setOpen={setOpen}
        />
        <Tab.Group>
          <Tab.List className={'grid grid-cols-2'}>
            <button
              onClick={() => {
                setPairTab(true);
                setSelectedTokens([]);
              }}
            >
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
            <button
              onClick={() => {
                setPairTab(false);
                setSelectedPairs([]);
              }}
            >
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
              <Pairs
                selectedPairs={selectedPairs}
                setSelectedPairs={setSelectedPairs}
                positions={positions.positions}
              />
            </Tab.Panel>
            <Tab.Panel>
              <Tokens tokens={tokens.tokens} setSelectedTokens={setSelectedTokens} selectedTokens={selectedTokens} />
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>

        <div className="absolute bottom-0 left-0">
          <img src={zapper} alt="zapper" width={'200px'} />
        </div>

        <div className="absolute right-6 bottom-6">
          {selectedPairs.length > 0 && (
            <>
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
              </button>{' '}
            </>
          )}
          {selectedTokens.length > 0 && (
            <button
              className="px-16 text-lg font-medium text-white bg-pink-500 rounded hover:bg-pink-600"
              onClick={() => {
                setModalContent('buyWeth');
                setOpen(true);
              }}
            >
              Buy WETH!
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default Unwindooor;
