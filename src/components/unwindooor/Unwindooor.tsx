import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { useContext, useEffect, useState } from 'react';
import UnwindModal from './modal';
import Dashboard from './dashboard';
import { UNWINDOOOR_ADDR, queryUnwindooorPositions } from './../../helpers/unwindooor';
import { Tab } from '@headlessui/react';
import Pairs from './Pairs';
import Tokens from './Tokens';
import { TxPending } from '../../context';

const Unwindooor = (): JSX.Element => {
  const context = useWeb3React<Web3Provider>();
  const { active, chainId } = context;
  const { setTxPending } = useContext(TxPending);
  const [selectedPairs, setSelectedPairs]: [any[], Function] = useState([]);
  const [openModal, setOpenModal]: [string, Function] = useState('');
  const [params, setParams] = useState({});
  const [loading, setLoading] = useState(false);
  const [data, setData]: [data: any, setData: Function] = useState({
    totalFees: 0,
    positions: [],
  });

  useEffect(() => {
    const fetchPositions = async () => {
      if (!active || !chainId || !UNWINDOOOR_ADDR[chainId]) return;
      setLoading(true);
      setData(await queryUnwindooorPositions(chainId));
      setLoading(false);
    };
    fetchPositions();
  }, [active, chainId]);

  if (chainId && !UNWINDOOOR_ADDR[chainId]) {
    return <div className={'mt-24 text-xl text-center text-white'}>Unwindooor is not available on this network.</div>;
  }
  if (loading) return <div className="container p-16 mx-auto text-center text-white">Loading data...</div>;
  if (!active) return <div className="container p-16 mx-auto text-center text-white">Please connect your wallet.</div>;

  return (
    <>
      <UnwindModal openModal={openModal} setOpenModal={setOpenModal} params={params} />
      <div className="container p-16 mx-auto text-center text-white">
        <Dashboard
          totalFees={data.totalFees}
          setOpenModal={setOpenModal}
          setParams={setParams}
          setTxPending={setTxPending}
        />
        <Tab.Group>
          <Tab.List>
            <Tab>Pairs</Tab>
            <Tab>Tab 2</Tab>
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
          <button
            className="absolute px-16 text-lg font-medium text-white bg-pink-500 rounded bottom-6 right-6 hover:bg-pink-600"
            onClick={() => {
              setParams({
                pairs: selectedPairs,
                setTxPending: setTxPending,
              });
              setOpenModal('unwind');
            }}
          >
            Unwind!
          </button>
        )}
      </div>
    </>
  );
};

export default Unwindooor;
