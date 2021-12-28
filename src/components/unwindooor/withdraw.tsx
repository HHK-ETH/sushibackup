import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { Contract, providers } from 'ethers';
import { parseUnits } from 'ethers/lib/utils';
import { useState } from 'react';
import { NETWORKS } from '../../helpers/network';
import { PRODUCTS, PRODUCT_IDS } from '../../helpers/products';
import { WETH } from '../../imports/tokens';

const Withdraw = ({ setTxPending, wethBalance }: { setTxPending: Function; wethBalance: number }): JSX.Element => {
  const context = useWeb3React<Web3Provider>();
  const { active, chainId, connector, account } = context;
  const [amount, setAmount] = useState(0);
  const [recipient, setRecipient] = useState('');

  const execWithdraw = async () => {
    if (!chainId || !connector || !account) return;
    const provider = new providers.Web3Provider(await connector.getProvider(), 'any');
    const maker = new Contract(
      PRODUCTS[PRODUCT_IDS.UNWINDOOOR].networks[chainId],
      PRODUCTS[PRODUCT_IDS.UNWINDOOOR].ABI,
      provider
    ).connect(provider.getSigner());
    const owner = await maker.owner();
    if (account.toLowerCase() !== owner.toLowerCase()) {
      alert('Only owner can withdraw funds.');
      return;
    }
    const tx = await maker.withdraw(WETH[chainId], recipient, parseUnits(amount.toString(), 'ether'));
    setTxPending(NETWORKS[chainId].explorer + 'tx/' + tx.hash);
    await provider.waitForTransaction(tx.hash, 1);
    setTxPending('');
  };

  if (!active) return <div className="text-center text-white">Please connect your wallet.</div>;

  return (
    <div className="text-center text-white">
      <div className="p-2 mt-4 text-lg rounded-lg">
        <div className="grid grid-cols-5 mb-4">
          <h3>To:</h3>
          <input
            className="col-span-4 text-center bg-indigo-700 rounded-lg"
            type={'text'}
            placeholder="Enter recipient address"
            onChange={(e) => setRecipient(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-5 mb-4">
          <h3>Amount:</h3>
          <input
            className="col-span-3 text-center bg-indigo-700 rounded-lg"
            type={'text'}
            placeholder="Enter the amount"
            onChange={(e) => setAmount(parseFloat(e.target.value))}
            value={amount}
          />
          <button
            className={'text-lg font-medium text-white rounded-full bg-pink-500 hover:bg-pink-600'}
            onClick={() => setAmount(wethBalance)}
          >
            MAX
          </button>
        </div>
        <button
          className={'px-16 text-lg font-medium text-white bg-pink-500 rounded hover:bg-pink-600'}
          onClick={() => execWithdraw()}
        >
          Withdraw
        </button>
      </div>
    </div>
  );
};

export default Withdraw;
