import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { Contract, providers } from 'ethers';
import { formatUnits } from 'ethers/lib/utils';
import { useContext, useEffect, useState } from 'react';
import { TxPending } from '../../context';
import { BENTOBOX_ADDR, BENTOBOX_ENDPOINT, queryBentoboxPositions } from '../../helpers/bentobox';
import bentoBoxABI from '../../imports/abis/bento.json';

const Bentobox = (): JSX.Element => {
  const context = useWeb3React<Web3Provider>();
  const { active, chainId, connector, account } = context;
  const { txPending, setTxPending } = useContext(TxPending);
  const [positions, setPositions]: [positions: any[], setPositions: Function] = useState([]);
  const [loading, setLoading]: [loading: boolean, setLoading: Function] = useState(false);

  const withdraw = async (token: string, share: string) => {
    if (!connector || !chainId || !account) return;
    const web3Provider = new providers.Web3Provider(await connector.getProvider(), 'any');
    let bentobox = new Contract(BENTOBOX_ADDR[chainId], bentoBoxABI, web3Provider);
    bentobox = bentobox.connect(web3Provider.getSigner());
    const tx = await bentobox.withdraw(token, account, account, 0, share);
    setTxPending(tx.hash);
    await web3Provider.waitForTransaction(tx.hash, 2);
    setTxPending('');
  };

  useEffect(() => {
    const fetchFarms = async () => {
      if (txPending !== '') return;
      if (!active || !connector || !account || !chainId) return;
      if (!BENTOBOX_ENDPOINT[chainId]) return;
      setLoading(true);
      const web3Provider = new providers.Web3Provider(await connector.getProvider(), 'any');
      const pos = await queryBentoboxPositions(chainId, account, web3Provider);
      setPositions(pos === null ? [] : pos);
      setLoading(false);
    };
    fetchFarms();
  }, [chainId, active, account, txPending, connector]);

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
