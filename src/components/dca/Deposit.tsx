import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { BigNumber, Contract, providers } from 'ethers';
import { formatUnits } from 'ethers/lib/utils';
import { useEffect, useState } from 'react';
import { BENTOBOX_ADDR } from '../../helpers/bentobox';
import Modal from '../general/Modal';
import erc20abi from './../../imports/abis/erc20.json';
import bentoAbi from './../../imports/abis/bento.json';

const Deposit = ({ open, setOpen, vault }: { open: boolean; setOpen: Function; vault: any }): JSX.Element => {
  const context = useWeb3React<Web3Provider>();
  const { chainId, connector, account } = context;
  const [fromWallet, setFromWallet] = useState(true);
  const [amount, setAmount] = useState(0);
  const [balance, setBalance] = useState(BigNumber.from(0));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBalance = async () => {
      if (!connector || !account || !chainId || vault === null) {
        return;
      }
      setLoading(true);
      const web3Provider = new providers.Web3Provider(await connector.getProvider(), 'any');
      if (fromWallet) {
        const erc20 = new Contract(vault.sellToken.id, erc20abi, web3Provider);
        setBalance(await erc20.balanceOf(account));
      } else {
        const bento = new Contract(BENTOBOX_ADDR[chainId], bentoAbi, web3Provider);
        const shares = await bento.balanceOf(vault.sellToken.id, account);
        setBalance(await bento.toAmount(vault.sellToken.id, shares, false));
      }
      setLoading(false);
    };
    fetchBalance();
  }, [account, chainId, connector, fromWallet, vault]);

  const deposit = async () => {
    if (!connector || !account || !chainId || vault === null) {
      return;
    }
    const web3Provider = new providers.Web3Provider(await connector.getProvider(), 'any');
    const bento = new Contract(BENTOBOX_ADDR[chainId], bentoAbi, web3Provider);
    let tx;
    if (fromWallet) {
      //todo add approve
      tx = await bento.deposit();
    } else {
      tx = await bento.transfer();
    }
  };

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
            <button
              className={'px-8 py-1 m-2 text-xl text-white bg-pink-500 rounded hover:bg-pink-600 inline-block'}
              onClick={() => {}}
            >
              Deposit
            </button>
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
