import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { useState } from 'react';
import { SUBGRAPH_ENDPOINTS } from '../../helpers/trident';
import useFetchTridentPositions from '../../hooks/trident/useFetchTridentPositions';
import Remove from './Remove';

const Trident = (): JSX.Element => {
  const context = useWeb3React<Web3Provider>();
  const { active, chainId, account } = context;
  const [open, setOpen] = useState(false);
  const [targetPos, settargetPos] = useState(null);
  const { positions, loading, fetchTridentPositions } = useFetchTridentPositions(account);

  if (!active || !chainId || !SUBGRAPH_ENDPOINTS[chainId]) {
    return <div className="text-center text-white">Please connect your wallet and switch de a valid network.</div>;
  }

  if (loading) {
    return <div className="text-center text-white">Loading data...</div>;
  }

  return (
    <>
      {targetPos !== null && (
        <Remove open={open} setOpen={setOpen} position={targetPos} fetchTridentPositions={fetchTridentPositions} />
      )}
      <div className="container p-16 mx-auto text-center text-white">
        <h1 className="text-xl">You have {positions.length} Trident position(s).</h1>
        <div className="grid mt-2 text-xl bg-indigo-900 md:grid-cols-7 sm:grid-cols-1 rounded-t-xl">
          <div>Pair</div>
          <div className="md:col-span-2">Address</div>
          <div>Fee tier</div>
          <div className="md:col-span-2">Balance</div>
          <div>Action</div>
        </div>
        <div className="rounded-b-xl">
          {positions.map((position: any, index: number) => {
            return (
              <div
                key={index}
                className="grid py-2 break-all bg-indigo-900 md:grid-cols-7 sm:grid-cols-1 text-md bg-opacity-60 hover:bg-opacity-75"
              >
                <div>{position.pool.assets[0].token.symbol + ' - ' + position.pool.assets[1].token.symbol}</div>
                <div className="md:col-span-2">{position.pool.id}</div>
                <div>{parseInt(position.pool.swapFee, 10) / 100} %</div>
                <div className="md:col-span-2">{position.balance} SLP</div>
                <div>
                  <button
                    className={'mr-2 px-8 font-medium text-white bg-pink-500 rounded hover:bg-pink-600 inline-block'}
                    onClick={() => {
                      settargetPos(position);
                      setOpen(true);
                    }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Trident;
