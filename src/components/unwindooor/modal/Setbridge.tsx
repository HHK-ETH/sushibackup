import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { Contract, providers } from 'ethers';
import { useState } from 'react';
import { NETWORKS } from '../../../helpers/network';
import { UNWINDOOOR_ADDR } from '../../../helpers/unwindooor';
import wethMakerABI from '../../../imports/abis/wethMaker.json';

const SetBridge = ({ setTxPending, isOwner }: { setTxPending: Function; isOwner: boolean }): JSX.Element => {
  const context = useWeb3React<Web3Provider>();
  const { chainId, connector } = context;
  const [token, setToken] = useState({
    input: '',
    bridge: '',
  });

  if (!isOwner)
    return (
      <div className="text-center text-white">Only owner can set bridge. Please connect with the right account.</div>
    );

  const executeSetBridge = async () => {
    if (!chainId || !connector) return;
    const provider = new providers.Web3Provider(await connector.getProvider(), 'any');
    const maker = new Contract(UNWINDOOOR_ADDR[chainId], wethMakerABI, provider).connect(provider.getSigner());
    const tx = await maker.setBridge(token.input, token.bridge);
    setTxPending(NETWORKS[chainId].explorer + 'tx/' + tx.hash);
    await provider.waitForTransaction(tx.hash, 1);
    setTxPending('');
  };

  return (
    <div className="text-center text-white text-md">
      <h3 className="mb-4 text-xl">Set bridge</h3>
      <div>
        <h3>Input token :</h3>
        <input
          className="w-3/4 py-2 mb-4 text-sm text-center bg-indigo-700 rounded-lg"
          type={'text'}
          placeholder="Enter token address"
          onChange={(e) =>
            setToken({
              input: e.target.value,
              bridge: token.bridge,
            })
          }
        />
        <h3>Bridge token :</h3>
        <input
          className="w-3/4 py-2 mb-6 text-sm text-center bg-indigo-700 rounded-lg"
          type={'text'}
          placeholder="Enter token address"
          onChange={(e) =>
            setToken({
              input: token.input,
              bridge: e.target.value,
            })
          }
        />
      </div>
      <button
        className={'px-16 text-lg font-medium text-white bg-pink-500 rounded hover:bg-pink-600'}
        onClick={() => executeSetBridge()}
      >
        Execute
      </button>
    </div>
  );
};

export default SetBridge;
