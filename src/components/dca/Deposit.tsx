import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { formatUnits, parseUnits } from 'ethers/lib/utils';
import { useState } from 'react';
import { BENTOBOX_ADDR } from '../../helpers/bentobox';
import Modal from '../general/Modal';
import useApprove from '../../hooks/useApprove';
import useDepositDca from '../../hooks/dca/useDepositDca';
import useFetchDepositBalance from '../../hooks/dca/useFetchDepositBalance';

const Deposit = ({ open, setOpen, vault }: { open: boolean; setOpen: Function; vault: any }): JSX.Element => {
  const context = useWeb3React<Web3Provider>();
  const { chainId, account } = context;
  const [fromWallet, setFromWallet] = useState(true);
  const [amount, setAmount] = useState(0);
  const { balance, allowance, loading } = useFetchDepositBalance(account, vault, fromWallet);

  const approve = useApprove(
    vault.sellToken.id,
    BENTOBOX_ADDR[chainId ? chainId : 1],
    parseUnits(amount.toString(), vault.sellToken.decimals)
  );
  const deposit = useDepositDca({ account, vault, fromWallet, amount });

  if (vault === null) return <></>;
  return (
    <Modal open={open} setOpen={setOpen}>
      <div className="text-center text-white">
        <h1 className="text-2xl">Deposit {vault.sellToken.symbol} in the vault</h1>
        <div className="grid grid-cols-3 gap-2 mt-4">
          <span>From :</span>
          <button
            className={
              fromWallet
                ? 'text-lg font-medium text-white rounded-full bg-purple-700'
                : 'text-lg font-medium text-white rounded-full bg-pink-500 hover:bg-pink-600'
            }
            onClick={() => setFromWallet(true)}
          >
            Wallet
          </button>
          <button
            className={
              !fromWallet
                ? 'text-lg font-medium text-white rounded-full bg-purple-700'
                : 'text-lg font-medium text-white rounded-full bg-pink-500 hover:bg-pink-600'
            }
            onClick={() => setFromWallet(false)}
          >
            Bentobox
          </button>
        </div>
        <div className="grid grid-cols-3 mt-4">
          <span>Amount :</span>
          <div className="col-span-2 mx-8">
            <input
              className="px-2 text-center text-white bg-indigo-700 rounded-full inline-blockfont-medium text-md"
              type={'number'}
              value={amount}
              onChange={(e) => {
                const value = parseFloat(e.target.value);
                if (value < 0 || isNaN(value)) {
                  setAmount(0);
                  return;
                }
                setAmount(value);
              }}
            />
            <span className="text-sm text-indigo-500">
              Your balance: {loading ? '...' : parseFloat(formatUnits(balance, vault.sellToken.decimals)).toFixed(4)}{' '}
              {vault.sellToken.symbol}
            </span>
          </div>
        </div>
        {parseFloat(formatUnits(balance, vault.sellToken.decimals)) >= amount && (
          <>
            <p className="block mt-8">
              Deposit{' '}
              <span className="font-semibold text-pink-500">
                {amount} {vault.sellToken.symbol}
              </span>{' '}
              from <span className="font-semibold text-pink-500">{fromWallet ? 'wallet' : 'Bentobox'} </span>
              to the vault.
            </p>
            {(allowance.lt(parseUnits(amount.toString(), vault.sellToken.decimals)) && fromWallet && (
              <button
                className={'px-8 py-1 m-2 text-xl text-white bg-pink-500 rounded hover:bg-pink-600 inline-block'}
                onClick={() => approve()}
              >
                Approve
              </button>
            )) || (
              <button
                className={'px-8 py-1 m-2 text-xl text-white bg-pink-500 rounded hover:bg-pink-600 inline-block'}
                onClick={() => deposit()}
              >
                Deposit
              </button>
            )}
          </>
        )}
        {parseFloat(formatUnits(balance, vault.sellToken.decimals)) < amount && (
          <p className="block mt-8">Insufficient balance.</p>
        )}
      </div>
    </Modal>
  );
};

export default Deposit;
