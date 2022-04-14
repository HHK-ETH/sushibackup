import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { Contract, providers } from 'ethers';
import { formatUnits } from 'ethers/lib/utils';
import { useContext, useEffect, useState } from 'react';
import { TxPending } from '../../context';
import { NETWORKS } from '../../helpers/network';
import { IFarmPosition, MINICHEF_ADDR, queryFarmPositions } from './../../helpers/farm';

const Farm = (): JSX.Element => {
  const context = useWeb3React<Web3Provider>();
  const { active, chainId, connector, account } = context;
  const { txPending, setTxPending } = useContext(TxPending);
  const [positions, setPositions]: [positions: IFarmPosition[], setPositions: Function] = useState([]);
  const [loading, setLoading]: [loading: boolean, setLoading: Function] = useState(false);

  const unstake = async (harvest: boolean, contract: Contract, pid: string, amount: string) => {
    if (!connector || !chainId || !account) return;
    const web3Provider = new providers.Web3Provider(await connector.getProvider(), 'any');
    contract = contract.connect(web3Provider.getSigner());
    let tx;
    if (chainId === 1 && contract.address === '0xc2EdaD668740f1aA35E4D8f227fB8E17dcA888Cd') {
      //msv1
      tx = await contract.withdraw(pid, amount);
    } else {
      if (harvest) {
        tx = await contract.withdrawAndHarvest(pid, amount, account);
      } else {
        tx = await contract.withdraw(pid, amount, account);
      }
    }
    setTxPending(NETWORKS[chainId].explorer + 'tx/' + tx.hash);
    await web3Provider.waitForTransaction(tx.hash, 2);
    setTxPending('');
  };

  const harvest = async (contract: Contract, pid: string) => {
    if (!connector || !chainId || !account) return;
    const web3Provider = new providers.Web3Provider(await connector.getProvider(), 'any');
    contract = contract.connect(web3Provider.getSigner());
    let tx;
    if (chainId === 1 && contract.address === '0xc2EdaD668740f1aA35E4D8f227fB8E17dcA888Cd') {
      //msv1
      tx = await contract.deposit(pid, 0);
    } else {
      tx = await contract.harvest(pid, account);
    }
    setTxPending(NETWORKS[chainId].explorer + 'tx/' + tx.hash);
    await web3Provider.waitForTransaction(tx.hash, 2);
    setTxPending('');
  };

  useEffect(() => {
    const fetchFarms = async () => {
      if (txPending !== '') return;
      if (!active || !connector || !account || !chainId) return;
      if (chainId !== 1 && !MINICHEF_ADDR[chainId]) return;
      setLoading(true);
      const web3Provider = new providers.Web3Provider(await connector.getProvider(), 'any');
      setPositions(await queryFarmPositions(chainId, account, web3Provider));
      setLoading(false);
    };
    fetchFarms();
  }, [active, connector, chainId, account, txPending]);

  if (loading) {
    return <div className="text-center text-white">Loading data...</div>;
  }
  if (!active) {
    return <div className="text-center text-white">Please connect your wallet.</div>;
  }

  return (
    <>
      <div className="container p-16 mx-auto text-center text-white">
        <h1 className="text-xl">You have {positions.length} positions farming.</h1>
        <div className="grid grid-cols-5 mt-2 text-xl bg-indigo-900 rounded-t-xl">
          <div>Pair</div>
          <div>Balance</div>
          <div>Rewards</div>
          <div className="col-span-2">Action</div>
        </div>
        <div className="rounded-b-xl">
          {positions.map((position: IFarmPosition, index: number) => {
            return (
              <div
                key={index}
                className="grid grid-cols-5 py-2 bg-indigo-900 text-md bg-opacity-60 hover:bg-opacity-75"
              >
                <div>{position.name}</div>
                <div>{formatUnits(position.amount)} SLP</div>
                <div>
                  <div>{formatUnits(position.pendingSushi)} SUSHI</div>
                  {position.rewardToken && position.pendingToken && (
                    <div>
                      {formatUnits(position.pendingToken)} {position.rewardToken}
                    </div>
                  )}
                </div>
                <div className="col-span-2">
                  <button
                    className={'mr-2 px-8 font-medium text-white bg-pink-500 rounded hover:bg-pink-600 inline-block'}
                    onClick={() => unstake(false, position.contract, position.pid, position.amount)}
                  >
                    Unstake
                  </button>
                  <button
                    className={'mr-2 px-8 font-medium text-white bg-pink-500 rounded hover:bg-pink-600 inline-block'}
                    onClick={() => harvest(position.contract, position.pid)}
                  >
                    Harvest
                  </button>
                  <button
                    className={'px-8 font-medium text-white bg-pink-500 rounded hover:bg-pink-600 inline-block'}
                    onClick={() => unstake(true, position.contract, position.pid, position.amount)}
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
