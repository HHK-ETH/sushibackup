import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { formatUnits } from 'ethers/lib/utils';
import useFetchbalances from '../../hooks/bento/useFetchBalances';
import useWithdrawBento from '../../hooks/bento/useWithdrawBento';

const Bentobox = (): JSX.Element => {
  const context = useWeb3React<Web3Provider>();
  const { active, account } = context;
  const { positions, loading } = useFetchbalances(account);
  const withdraw = useWithdrawBento(account);

  if (loading) {
    return <div className="text-center text-white">Loading data...</div>;
  }
  if (!active) {
    return <div className="text-center text-white">Please connect your wallet.</div>;
  }

  return (
    <>
      <div className="container p-16 mx-auto text-center text-white">
        <h1 className="text-xl">You have {positions.length} positions in BentoBox.</h1>
        <div className="grid grid-cols-3 mt-2 text-xl bg-indigo-900 rounded-t-xl">
          <div>Token</div>
          <div>Balance</div>
          <div>Action</div>
        </div>
        <div className="rounded-b-xl">
          {positions.map((position: any, index: number) => {
            return (
              <div
                key={index}
                className="grid grid-cols-3 py-2 bg-indigo-900 text-md bg-opacity-60 hover:bg-opacity-75"
              >
                <div>
                  {position.token.name} ({position.token.symbol})
                </div>
                <div>{formatUnits(position.amount, position.token.decimals)}</div>
                <div>
                  <button
                    className={'px-8 font-medium text-white bg-pink-500 rounded hover:bg-pink-600 inline-block'}
                    onClick={() => withdraw(position.token.id, position.share)}
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

export default Bentobox;
