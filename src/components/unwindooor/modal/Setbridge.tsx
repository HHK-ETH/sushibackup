import { useState } from 'react';
import useSetBridge from '../../../hooks/useSetBridge';

const SetBridge = ({ isOwner }: { isOwner: boolean }): JSX.Element => {
  const [token, setToken] = useState({
    input: '',
    bridge: '',
  });
  const setBridge = useSetBridge(token);

  if (!isOwner)
    return (
      <div className="text-center text-white">Only owner can set bridge. Please connect with the right account.</div>
    );

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
        onClick={() => setBridge()}
      >
        Execute
      </button>
    </div>
  );
};

export default SetBridge;
