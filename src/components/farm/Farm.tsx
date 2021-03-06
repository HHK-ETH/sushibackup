import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { formatUnits } from 'ethers/lib/utils';
import { IFarmPosition } from '../../helpers/farm';
import useFetchFarmsWeb3 from '../../hooks/farm/useFetchFarmWeb3';
import useHarvest from '../../hooks/farm/useHarvest';
import useUnstake from '../../hooks/farm/useUnstake';

const Farm = (): JSX.Element => {
  const context = useWeb3React<Web3Provider>();
  const { active, account } = context;
  const { positions, loading, fetchFarms } = useFetchFarmsWeb3(account);
  const unstake = useUnstake(account, fetchFarms);
  const harvest = useHarvest(account, fetchFarms);

  if (loading) {
    return <div className="text-center text-white">Loading data...</div>;
  }
  if (!active) {
    return <div className="text-center text-white">Please connect your wallet.</div>;
  }

  return (
    <>
      <div className="container p-16 mx-auto text-center text-white">
        <h1 className="text-xl">You have {positions.length} positions farming or with rewards available.</h1>
        <div className="grid mt-2 text-xl bg-indigo-900 md:grid-cols-5 sm:grid-cols-1 rounded-t-xl">
          <div>Pair</div>
          <div>Balance</div>
          <div>Rewards</div>
          <div className="md:col-span-2">Action</div>
        </div>
        <div className="rounded-b-xl">
          {positions.map((position: IFarmPosition, index: number) => {
            return (
              <div
                key={index}
                className="grid py-2 bg-indigo-900 md:grid-cols-5 sm:grid-cols-1 text-md bg-opacity-60 hover:bg-opacity-75"
              >
                <div>{position.pair}</div>
                <div>{formatUnits(position.amount)} SLP</div>
                <div>
                  <div>{parseFloat(formatUnits(position.pendingSushi)).toFixed(6)} SUSHI</div>
                  {position.pendingToken.gt(0) && (
                    <div>
                      {parseFloat(formatUnits(position.pendingToken)).toFixed(6)} {position.rewardToken}
                    </div>
                  )}
                </div>
                <div className="md:col-span-2">
                  <button
                    className={
                      'mr-2 m-1 px-8 font-medium text-white bg-pink-500 rounded hover:bg-pink-600 inline-block'
                    }
                    onClick={() =>
                      unstake({
                        harvest: false,
                        contract: position.contract,
                        pid: position.pid,
                        amount: position.amount,
                      })
                    }
                  >
                    Unstake
                  </button>
                  <button
                    className={
                      'mr-2 m-1 px-8 font-medium text-white bg-pink-500 rounded hover:bg-pink-600 inline-block'
                    }
                    onClick={() => harvest({ contract: position.contract, pid: position.pid })}
                  >
                    Harvest
                  </button>
                  <button
                    className={'px-8 m-1 font-medium text-white bg-pink-500 rounded hover:bg-pink-600 inline-block'}
                    onClick={() =>
                      unstake({
                        harvest: true,
                        contract: position.contract,
                        pid: position.pid,
                        amount: position.amount,
                      })
                    }
                  >
                    Unstake & Harvest
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

export default Farm;
