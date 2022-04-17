import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { useState } from 'react';
import useUnwindWithdraw from '../../../hooks/useUnwindWithdraw';

const Withdraw = ({ wethBalance, isOwner }: { wethBalance: number; isOwner: boolean }): JSX.Element => {
  const context = useWeb3React<Web3Provider>();
  const { active } = context;
  const [amount, setAmount] = useState(0);
  const [recipient, setRecipient] = useState('');
  const withdraw = useUnwindWithdraw(recipient, amount);

  if (!isOwner)
    return (
      <div className="text-center text-white">Only owner can withdraw WETH. Please connect with the right account.</div>
    );

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
          onClick={() => withdraw()}
        >
          Withdraw
        </button>
      </div>
    </div>
  );
};

export default Withdraw;
