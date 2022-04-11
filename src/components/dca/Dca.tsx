import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { formatUnits } from 'ethers/lib/utils';
import { useEffect, useState } from 'react';
import { DCA_FACTORY, queryVaults } from '../../helpers/dca';
import TxPendingModal from '../general/TxPendingModal';
import CreateVault from './CreateVault';
import Deposit from './Deposit';
import Withdraw from './Withdraw';

const Dca = (): JSX.Element => {
  const context = useWeb3React<Web3Provider>();
  const { active, chainId, account } = context;
  const [txPending, setTxPending]: [txPending: string, setTxPending: Function] = useState('');
  const [loading, setLoading]: [loading: boolean, setLoading: Function] = useState(false);
  const [open, setOpen]: [open: boolean, setOpen: Function] = useState(false);
  const [openDeposit, setOpenDeposit]: [open: boolean, setOpen: Function] = useState(false);
  const [openWithdraw, setOpenWithdraw]: [open: boolean, setOpen: Function] = useState(false);
  const [vaults, setVaults]: [vaults: any[], setVaults: Function] = useState([]);
  const [selectedVault, setSelectedVault]: [selectedVault: any, setselectedVault: Function] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!chainId || !account || !DCA_FACTORY[chainId]) {
        return;
      }
      setLoading(true);
      setVaults(await queryVaults(chainId, account));
      setLoading(false);
    };
    fetchData();
  }, [chainId, account, active]);

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
      <Deposit open={openDeposit} setOpen={setOpenDeposit} vault={selectedVault} setPending={setTxPending} />
      <Withdraw open={openWithdraw} setOpen={setOpenWithdraw} vault={selectedVault} />
      <div className="container p-16 mx-auto text-center text-white">
        <h1 className="mb-2 text-xl">You have {vaults.length} vaults.</h1>
        <button
          className={'px-8 py-2 font-medium text-white bg-pink-500 rounded hover:bg-pink-600 inline-block'}
          onClick={() => setOpen(true)}
        >
          Create a new vault
        </button>
        <div className="grid grid-cols-8 mt-4 text-xl bg-indigo-900 rounded-t-xl">
          <div>Token to sell</div>
          <div>Token to buy</div>
          <div>Balance</div>
          <div>Total bought</div>
          <div>Frequency</div>
          <div>Next execution</div>
          <div className="col-span-2">Action</div>
        </div>
        <div className="rounded-b-xl">
          {vaults.map((vault, index: number) => {
            let nextExec = vault.nextExecutableTimestamp;
            const today = new Date().getTime() / 1000;
            if (nextExec !== 0 && nextExec > today) {
              nextExec = (nextExec - today) / (3600 * 24);
            } else {
              nextExec = 0;
            }
            return (
              <div
                key={index}
                className="grid grid-cols-8 py-2 bg-indigo-900 text-md bg-opacity-60 hover:bg-opacity-75"
              >
                <div>{vault.sellToken.symbol}</div>
                <div>{vault.buyToken.symbol}</div>
                <div>
                  {parseFloat(formatUnits(vault.balance, vault.sellToken.decimals)).toFixed(4)} {vault.sellToken.symbol}
                </div>
                <div>
                  {vault.totalBuy} {vault.buyToken.symbol}
                </div>
                <div>Every {vault.epochDuration / (3600 * 24)} days</div>
                <div>In {nextExec} days</div>
                <div className="col-span-2">
                  <button
                    className={'mr-2 px-8 font-medium text-white bg-pink-500 rounded hover:bg-pink-600 inline-block'}
                    onClick={() => {
                      setSelectedVault(vault);
                      setOpenDeposit(true);
                    }}
                  >
                    Deposit
                  </button>
                  <button
                    className={'px-8 font-medium text-white bg-pink-500 rounded hover:bg-pink-600 inline-block'}
                    onClick={() => {
                      setSelectedVault(vault);
                      setOpenWithdraw(true);
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
