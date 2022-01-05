import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { useEffect, useState } from 'react';
import UnwindModal from './modal';
import TxPendingModal from '../general/TxPendingModal';
import Dashboard from './dashboard';
import { UNWINDOOOR_ADDR, queryUnwindooorPositions } from './../../helpers/unwindooor';

const Unwindooor = (): JSX.Element => {
  const context = useWeb3React<Web3Provider>();
  const { active, chainId } = context;
  const [selectedPairs, setSelectedPairs]: [any[], Function] = useState([]);
  const [openModal, setOpenModal]: [string, Function] = useState('');
  const [txPending, setTxPending]: [txPending: string, setTxPending: Function] = useState('');
  const [params, setParams] = useState({});
  const [loading, setLoading] = useState(false);
  const [data, setData]: [data: any, setData: Function] = useState({
    totalFees: 0,
    positions: { user: { lp1: [], lp2: [] } },
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
      <TxPendingModal txPending={txPending} />
      <UnwindModal openModal={openModal} setOpenModal={setOpenModal} params={params} />
      <div className="container p-16 mx-auto text-center text-white">
        <Dashboard
          totalFees={data.totalFees}
          setOpenModal={setOpenModal}
          setParams={setParams}
          setTxPending={setTxPending}
        />
        {loading && <div className={'text-white'}>loading data...</div>}
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
        <div className="grid grid-cols-7 py-8 mt-4 bg-indigo-900 rounded-t-xl">
          <div className="">Pair</div>
          <div className="col-span-2">Token 0</div>
          <div className="col-span-2">Token 1</div>
          <div className="">Value</div>
          <div className="">Select</div>
        </div>
        {[...data.positions.user.lp1, ...data.positions.user.lp2]
          .sort((positionA: any, positionB: any) => {
            const pairA = positionA.pair;
            const valueA = (positionA.liquidityTokenBalance / pairA.totalSupply) * pairA.reserveUSD;
            const pairB = positionB.pair;
            const valueB = (positionB.liquidityTokenBalance / pairB.totalSupply) * pairB.reserveUSD;
            if (valueA > valueB) return -1;
            return +1;
          })
          .map((position: any, i: number) => {
            const pair = position.pair;
            const value = (position.liquidityTokenBalance / pair.totalSupply) * pair.reserveUSD;
            const amount0 = (position.liquidityTokenBalance / pair.totalSupply) * pair.reserve0;
            const amount1 = (position.liquidityTokenBalance / pair.totalSupply) * pair.reserve1;
            return (
              <div
                key={i}
                className="grid grid-cols-7 py-4 bg-indigo-900 cursor-pointer bg-opacity-60 hover:bg-opacity-75"
              >
                <div className="">{pair.name}</div>
                <div className="col-span-2">{amount0.toFixed(2) + ' ' + pair.token0.symbol}</div>
                <div className="col-span-2">{amount1.toFixed(2) + ' ' + pair.token1.symbol}</div>
                <div className="">{value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}$</div>
                <div>
                  <input
                    type={'checkbox'}
                    onChange={(e) => {
                      const tempPairs = [...selectedPairs];
                      if (e.target.checked) {
                        tempPairs.push(pair);
                        setSelectedPairs(tempPairs);
                      } else {
                        setSelectedPairs(
                          tempPairs.filter((p: any) => {
                            return p.id === pair.id ? false : true;
                          })
                        );
                      }
                    }}
                    checked={selectedPairs.indexOf(pair) !== -1}
                  />
                </div>
              </div>
            );
          })}
      </div>
    </>
  );
};

export default Unwindooor;
