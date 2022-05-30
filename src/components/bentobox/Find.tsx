import { formatUnits } from 'ethers/lib/utils';
import { useState } from 'react';
import useFindPosition from '../../hooks/bento/useFindPosition';
import useWithdrawBento from '../../hooks/bento/useWithdrawBento';

const Find = ({ account }: { account: string | null | undefined }): JSX.Element => {
  const [address, setAddress] = useState('');
  const { position, loading } = useFindPosition(account, address);
  const withdraw = useWithdrawBento(account, async () => {});

  return (
    <div className="text-center text-white">
      <h2 className="m-2 text-lg">Token address:</h2>
      <input
        className="w-3/4 py-2 mb-4 text-sm text-center bg-indigo-700 rounded-lg"
        placeholder="Enter token address here"
        onChange={(e) => setAddress(e.target.value)}
      />
      {address.length === 42 && !loading && (
        <div className="mt-4 text-lg">
          <h2>Token symbol: {position.symbol}</h2>
          <h2>BentoBox balance: {parseFloat(formatUnits(position.balance, position.decimals)).toFixed(4)}</h2>
          <button
            className={'px-8 mt-2 font-medium text-white bg-pink-500 rounded hover:bg-pink-600 inline-block'}
            onClick={() => withdraw(address, position.share)}
          >
            Withdraw
          </button>
        </div>
      )}
      {loading && <div>loading...</div>}
    </div>
  );
};

export default Find;
