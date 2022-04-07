import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { useState } from 'react';
import TxPendingModal from '../general/TxPendingModal';
import dcaABI from './../../imports/abis/dca.json';
import CreateVault from './CreateVault';

const Dca = (): JSX.Element => {
  const context = useWeb3React<Web3Provider>();
  const { active, chainId, connector, account } = context;
  const [txPending, setTxPending]: [txPending: string, setTxPending: Function] = useState('');
  const [loading, setLoading]: [loading: boolean, setLoading: Function] = useState(false);
  const [open, setOpen]: [open: boolean, setOpen: Function] = useState(false);

  if (loading) {
    return <div className="text-center text-white">Loading data...</div>;
  }
  if (!active) {
    return <div className="text-center text-white">Please connect your wallet.</div>;
  }

  return (
    <>
      <TxPendingModal txPending={txPending} />
      <CreateVault open={open} setOpen={setOpen} setTxPending={setTxPending} />
      <div className="container p-16 mx-auto text-center text-white">
        <h1 className="mb-2 text-xl">You have {0} vaults.</h1>
        <button
          className={'px-8 py-2 font-medium text-white bg-pink-500 rounded hover:bg-pink-600 inline-block'}
          onClick={() => setOpen(true)}
        >
          Create a new vault
        </button>
        <div className="grid grid-cols-5 mt-4 text-xl bg-indigo-900 rounded-t-xl">
          <div>Token to buy</div>
          <div>Token to sell</div>
          <div>Frequency</div>
          <div className="col-span-2">Action</div>
        </div>
        <div className="rounded-b-xl">
          {[].map((vault, index: number) => {
            return (
              <div
                key={index}
                className="grid grid-cols-5 py-2 bg-indigo-900 text-md bg-opacity-60 hover:bg-opacity-75"
              >
                <div></div>
                <div></div>
                <div></div>
                <div className="col-span-2">
                  <button
                    className={'mr-2 px-8 font-medium text-white bg-pink-500 rounded hover:bg-pink-600 inline-block'}
                    onClick={() => {}}
                  >
                    Deposit
                  </button>
                  <button
                    className={'px-8 font-medium text-white bg-pink-500 rounded hover:bg-pink-600 inline-block'}
                    onClick={() => {}}
                  >
                    Withdraw
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

export default Dca;
