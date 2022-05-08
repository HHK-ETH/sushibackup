import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { formatUnits } from 'ethers/lib/utils';
import { useState } from 'react';
import { CHAIN_IDS } from '../../helpers/network';
import useFetchVaults from '../../hooks/dca/useFetchVaults';
import Modal from '../general/Modal';
import CreateVault from './CreateVault';
import Deposit from './Deposit';
import Withdraw from './Withdraw';

const Dca = (): JSX.Element => {
  const context = useWeb3React<Web3Provider>();
  const { active, account, chainId } = context;
  const [open, setOpen]: [open: boolean, setOpen: Function] = useState(false);
  const [modalContent, setModalContent]: [content: string, setOpen: Function] = useState('');
  const [selectedVault, setSelectedVault]: [selectedVault: any, setselectedVault: Function] = useState(null);
  const { vaults, loading, fetchVaults } = useFetchVaults(account);

  if (chainId !== CHAIN_IDS.POLYGON) {
    return <div className="text-center text-white">Please connect to the Polygon blockchain.</div>;
  }
  if (loading) {
    return <div className="text-center text-white">Loading data...</div>;
  }
  if (!active) {
    return <div className="text-center text-white">Please connect your wallet.</div>;
  }

  return (
    <>
      <Modal open={open} setOpen={setOpen}>
        {modalContent === 'create' && <CreateVault fetchVaults={fetchVaults} />}
        {modalContent === 'deposit' && <Deposit vault={selectedVault} fetchVaults={fetchVaults} />}
        {modalContent === 'withdraw' && <Withdraw vault={selectedVault} fetchVaults={fetchVaults} />}
      </Modal>
      <div className="container p-16 mx-auto text-center text-white">
        <h1 className="mb-2 text-xl">You have {vaults.length} vaults.</h1>
        <button
          className={'px-8 py-2 font-medium text-white bg-pink-500 rounded hover:bg-pink-600 inline-block'}
          onClick={() => {
            setModalContent('create');
            setOpen(true);
          }}
        >
          Create a new vault
        </button>
        <div className="grid grid-cols-8 mt-4 text-xl bg-indigo-900 rounded-t-xl">
          <div>Tokens</div>
          <div>Balance</div>
          <div>Total bought</div>
          <div>Amount</div>
          <div>Frequency</div>
          <div>Next execution</div>
          <div className="col-span-2">Action</div>
        </div>
        <div className="rounded-b-xl">
          {vaults.map((vault, index: number) => {
            let nextExec = vault.nextExecutableTimestamp;
            const today = new Date().getTime() / 1000;
            if (nextExec !== 0 && nextExec > today) {
              nextExec = ((nextExec - today) / (3600 * 24)).toFixed(3);
            } else {
              nextExec = 0;
            }
            return (
              <div
                key={index}
                className="grid grid-cols-8 py-2 bg-indigo-900 text-md bg-opacity-60 hover:bg-opacity-75"
              >
                <div>{vault.sellToken.symbol + ' => ' + vault.buyToken.symbol}</div>
                <div>
                  {parseFloat(formatUnits(vault.balance, vault.sellToken.decimals)).toFixed(4)} {vault.sellToken.symbol}
                </div>
                <div>
                  {parseFloat(formatUnits(vault.totalBuy, vault.buyToken.decimals)).toFixed(4)} {vault.buyToken.symbol}
                </div>
                <div>
                  {parseFloat(formatUnits(vault.amount, vault.sellToken.decimals)).toFixed(4)} {vault.sellToken.symbol}
                </div>
                <div>Every {vault.epochDuration / (3600 * 24)} days</div>
                <div>
                  {parseFloat(vault.balance) < parseFloat(vault.amount)
                    ? 'Insufficient balance'
                    : 'In ' + nextExec + ' days'}
                </div>
                <div className="col-span-2">
                  <button
                    className={'mr-2 px-8 font-medium text-white bg-pink-500 rounded hover:bg-pink-600 inline-block'}
                    onClick={() => {
                      setSelectedVault(vault);
                      setModalContent('deposit');
                      setOpen(true);
                    }}
                  >
                    Deposit
                  </button>
                  <button
                    className={'px-8 font-medium text-white bg-pink-500 rounded hover:bg-pink-600 inline-block'}
                    onClick={() => {
                      setSelectedVault(vault);
                      setModalContent('withdraw');
                      setOpen(true);
                    }}
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
