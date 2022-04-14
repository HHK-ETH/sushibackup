import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { useContext, useEffect, useState } from 'react';
import Dashboard from './dashboard';
import { UNWINDOOOR_ADDR, queryUnwindooorPositions, queryUnwindooorTokens } from './../../helpers/unwindooor';
import { Tab } from '@headlessui/react';
import Pairs from './Pairs';
import Tokens from './Tokens';
import { TxPending } from '../../context';
import Modal from '../general/Modal';
import UnwindPairs from './modal/UnwindPairs';
import BuyWeth from './modal/buyWeth';
import BuySushi from './modal/buySushi';
import Withdraw from './modal/withdraw';
import { BigNumber, Contract, providers } from 'ethers';
import { WETH } from '../../imports/tokens';
import erc20Abi from '../../imports/abis/erc20.json';
import { formatUnits } from 'ethers/lib/utils';
import BurnPairs from './modal/BurnPairs';
import sushiMakerAbi from '../../imports/abis/sushiMaker.json';
import SetBridge from './modal/Setbridge';

const Unwindooor = (): JSX.Element => {
  const context = useWeb3React<Web3Provider>();
  const { active, chainId, connector, account } = context;
  const { setTxPending } = useContext(TxPending);
  const [selectedPairs, setSelectedPairs]: [any[], Function] = useState([]);
  const [modalContent, setModalContent]: [string, Function] = useState('');
  const [open, setOpen]: [boolean, Function] = useState(false);
  const [wethBalance, setWethBalance] = useState(BigNumber.from(0));
  const [loading, setLoading] = useState(false);
  const [positions, setPositions]: [positions: any, setPositions: Function] = useState({
    totalFees: 0,
    positions: [],
  });
  const [tokens, setTokens]: [tokens: { total: number; tokens: any[] }, setTokens: Function] = useState({
    total: 0,
    tokens: [],
  });
  const [pairTab, setPairTab] = useState(true);
  const [isTrusted, setIsTrusted] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [selectedTokens, setSelectedTokens]: [selectedTokens: any[], setSelectedTokens: Function] = useState([]);

  useEffect(() => {
    const fetchPositions = async () => {
      if (!active || !chainId || !UNWINDOOOR_ADDR[chainId] || !connector) return;
      setLoading(true);
      setPositions(await queryUnwindooorPositions(chainId));
      setTokens(await queryUnwindooorTokens(chainId));
      const provider = new providers.Web3Provider(await connector.getProvider(), 'any');
      const weth = new Contract(WETH[chainId], erc20Abi, provider);
      const balance = await weth.balanceOf(UNWINDOOOR_ADDR[chainId]);
      setWethBalance(balance);
      const sushiMaker = new Contract(UNWINDOOOR_ADDR[chainId], sushiMakerAbi, provider.getSigner());
      const owner = await sushiMaker.owner();
      setIsOwner(owner === account);
      setIsTrusted(owner === account ? true : await sushiMaker.trusted(account));
      setLoading(false);
    };
    fetchPositions();
  }, [active, chainId, connector, account]);

  if (chainId && !UNWINDOOOR_ADDR[chainId]) {
    return <div className={'mt-24 text-xl text-center text-white'}>Unwindooor is not available on this network.</div>;
  }
  if (loading) return <div className="container p-16 mx-auto text-center text-white">Loading data...</div>;
  if (!active) return <div className="container p-16 mx-auto text-center text-white">Please connect your wallet.</div>;

  return (
    <>
      {isTrusted && (
        <Modal open={open} setOpen={setOpen}>
          {modalContent === 'unwind' && <UnwindPairs pairs={selectedPairs} setTxPending={setTxPending} />}
          {modalContent === 'burn' && <BurnPairs pairs={selectedPairs} setTxPending={setTxPending} />}
          {modalContent === 'buyWeth' && <BuyWeth setTxPending={setTxPending} selectedTokens={selectedTokens} />}
          {modalContent === 'buySushi' && (
            <BuySushi setTxPending={setTxPending} wethBalance={parseFloat(formatUnits(wethBalance))} />
          )}
          {modalContent === 'withdraw' && (
            <Withdraw
              setTxPending={setTxPending}
              wethBalance={parseFloat(formatUnits(wethBalance))}
              isOwner={isOwner}
            />
          )}
          {modalContent === 'setBridge' && <SetBridge setTxPending={setTxPending} isOwner={isOwner} />}
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
