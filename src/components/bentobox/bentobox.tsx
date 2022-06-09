import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { formatUnits, parseUnits } from 'ethers/lib/utils';
import { useState } from 'react';
import useFetchbalances from '../../hooks/bento/useFetchBalances';
import useWithdrawBento from '../../hooks/bento/useWithdrawBento';
import Modal from '../general/Modal';
import Find from './Find';

const Bentobox = (): JSX.Element => {
  const context = useWeb3React<Web3Provider>();
  const { active, account } = context;
  const { positions, loading, fetchBalances } = useFetchbalances(account);
  const withdraw = useWithdrawBento(account, fetchBalances);
  const [open, setOpen] = useState(false);

  if (loading) {
    return <div className="text-center text-white">Loading data...</div>;
  }
  if (!active) {
    return <div className="text-center text-white">Please connect your wallet.</div>;
  }

  return (
    <>
      <Modal open={open} setOpen={setOpen}>
        <Find account={account} />
      </Modal>
      <div className="container p-16 mx-auto text-center text-white">
        <h1 className="text-xl">You have {positions.length} positions in BentoBox.</h1>
        <div className="grid mt-2 text-xl bg-indigo-900 sm:grid-cols-1 md:grid-cols-3 rounded-t-xl">
          <div>Token</div>
          <div>Balance</div>
          <div>Action</div>
        </div>
        {positions.map((position: any, index: number) => {
          return (
            <div
              key={index}
              className="grid py-2 bg-indigo-900 md:grid-cols-3 sm:grid-cols-1 text-md bg-opacity-60 hover:bg-opacity-75"
            >
              <div>
                {position.token.name} ({position.token.symbol})
              </div>
              <div>{formatUnits(position.amount, position.token.decimals)}</div>
              <div>
                <button
                  className={'px-8 font-medium text-white bg-pink-500 rounded hover:bg-pink-600 inline-block'}
                  onClick={() => withdraw(position.token.id, parseUnits(position.share, position.token.decimals))}
                >
                  Withdraw
                </button>
              </div>
            </div>
          );
        })}
        <div className="inline-block p-4 mt-6 bg-indigo-900 rounded-lg">
          <h1 className="mb-2 text-xl">Position missing ?</h1>
          <button
            className={'px-8 font-medium text-white bg-pink-500 rounded hover:bg-pink-600 inline-block'}
            onClick={() => setOpen(true)}
          >
            Find a position manually
          </button>
        </div>
      </div>
    </>
  );
};

export default Bentobox;
