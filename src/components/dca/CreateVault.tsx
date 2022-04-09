import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { Contract, providers } from 'ethers';
import { parseUnits } from 'ethers/lib/utils';
import { useState } from 'react';
import { DCA_FACTORY, DCA_TOKENS } from '../../helpers/dca';
import { CHAIN_IDS, NETWORKS } from '../../helpers/network';
import Modal from '../general/Modal';
import dcaFactoryABI from './../../imports/abis/dcaFactory.json';

const CreateVault = ({
  open,
  setOpen,
  setTxPending,
}: {
  open: boolean;
  setOpen: Function;
  setTxPending: Function;
}): JSX.Element => {
  const context = useWeb3React<Web3Provider>();
  const { chainId, connector, account } = context;
  const [dcaData, setDcaData] = useState({
    buyToken: DCA_TOKENS[CHAIN_IDS.POLYGON][0],
    sellToken: DCA_TOKENS[CHAIN_IDS.POLYGON][0],
    frequency: 1,
    amount: 0,
  });

  const createDca = async () => {
    if (!connector || chainId !== CHAIN_IDS.POLYGON || !account) return;
    const web3Provider = new providers.Web3Provider(await connector.getProvider(), 'any');
    const factory = new Contract(DCA_FACTORY[CHAIN_IDS.POLYGON], dcaFactoryABI, web3Provider.getSigner());
    const frequency = dcaData.frequency * 3600 * 24;
    const amount = parseUnits(dcaData.amount.toString(), dcaData.sellToken.decimals);
    const tx = await factory.createDCA(
      account,
      dcaData.sellToken.address,
      dcaData.buyToken.address,
      dcaData.sellToken.priceFeed,
      dcaData.buyToken.priceFeed,
      frequency,
      dcaData.buyToken.decimals - dcaData.sellToken.decimals,
      amount
    );
    setTxPending(NETWORKS[CHAIN_IDS.POLYGON].explorer + 'tx/' + tx.hash);
    setOpen(false);
    await web3Provider.waitForTransaction(tx.hash, 2);
    setTxPending('');
  };

  return (
    <Modal open={open} setOpen={setOpen}>
      <div className="text-center text-white">
        <h1 className="mb-4 text-2xl">Create a new vault</h1>
        <div className="grid grid-cols-2 m-2">
          <label className="text-xl text-left">Token to sell: </label>
          <select
            className="text-center bg-indigo-700 rounded-full"
            onChange={(e) => {
              const token = DCA_TOKENS[CHAIN_IDS.POLYGON].find((token) => {
                return token.address === e.target.value;
              });
              if (token) {
                setDcaData({ ...dcaData, sellToken: token });
              }
            }}
          >
            {DCA_TOKENS[CHAIN_IDS.POLYGON].map((token) => {
              return (
                <option key={token.address + '0'} value={token.address}>
                  {token.symbol}
                </option>
              );
            })}
          </select>
        </div>
        <div className="grid grid-cols-2 m-2">
          <label className="text-xl text-left">Amount: </label>
          <input
            className="px-2 text-center text-white bg-indigo-700 rounded-full inline-blockfont-medium text-md"
            type={'number'}
            value={dcaData.amount}
            onChange={(e) => {
              let amount = parseFloat(e.target.value);
              if (amount < 0) amount = 0;
              setDcaData({ ...dcaData, amount: amount });
            }}
          />
        </div>
        <div className="grid grid-cols-2 m-2">
          <label className="text-xl text-left">Token to buy: </label>
          <select
            className="text-center bg-indigo-700 rounded-full"
            onChange={(e) => {
              const token = DCA_TOKENS[CHAIN_IDS.POLYGON].find((token) => {
                return token.address === e.target.value;
              });
              if (token) {
                setDcaData({ ...dcaData, buyToken: token });
              }
            }}
          >
            {DCA_TOKENS[CHAIN_IDS.POLYGON].map((token) => {
              return (
                <option key={token.address + '1'} value={token.address}>
                  {token.symbol}
                </option>
              );
            })}
          </select>
        </div>
        <div className="grid grid-cols-2 m-2">
          <label className="text-xl text-left">Frequency (in days): </label>
          <input
            className="px-2 text-center text-white bg-indigo-700 rounded-full inline-blockfont-medium text-md"
            type={'number'}
            value={dcaData.frequency}
            onChange={(e) => {
              let frequency = parseFloat(e.target.value);
              if (frequency < 1) frequency = 1;
              setDcaData({ ...dcaData, frequency: frequency });
            }}
          />
        </div>
        <p className="block mt-8">
          This vault will use <span className="font-semibold text-pink-500">{dcaData.amount}</span>{' '}
          <span className="font-semibold text-pink-500">{dcaData.sellToken.symbol}</span> to buy{' '}
          <span className="font-semibold text-pink-500">{dcaData.buyToken.symbol}</span> every{' '}
          <span className="font-semibold text-pink-500">{dcaData.frequency} </span>
          days and send them to your bentobox.
        </p>
        <button
          className={'px-8 py-1 m-2 text-xl text-white bg-pink-500 rounded hover:bg-pink-600 inline-block'}
          onClick={() => {
            createDca();
          }}
        >
          Create
        </button>
      </div>
    </Modal>
  );
};

export default CreateVault;
