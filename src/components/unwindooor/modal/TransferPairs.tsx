import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { parseUnits } from 'ethers/lib/utils';
import { UNWINDOOOR_ADDR } from '../../../helpers/unwindooor';
import useFetchPositions from '../../../hooks/unwind/useFetchPositions';
import useTransferToken from '../../../hooks/useTransferToken';

const TransferPairs = (): JSX.Element => {
  const context = useWeb3React<Web3Provider>();
  const { account, chainId } = context;
  const { positions, loading, fetchPositions } = useFetchPositions(account);
  const transferLps = useTransferToken(fetchPositions);

  if (loading) return <div className="text-center text-white">Loading...</div>;
  return (
    <div className="text-center text-white">
      <h1 className="mb-2 text-lg font-semibold">
        Positions for <span className="text-pink-500">{account}</span>
      </h1>
      <div className="grid grid-cols-4 mb-2 text-lg font-semibold">
        <div>Pair name</div>
        <div>Balance</div>
        <div>Value</div>
        <div>Action</div>
      </div>
      {positions.map((pos) => {
        const value =
          (parseFloat(pos.liquidityTokenBalance) / parseFloat(pos.pair.totalSupply)) * parseFloat(pos.pair.reserveUSD);
        return (
          <div className="grid grid-cols-4 mb-1 text-sm" key={pos.pair.id}>
            <div>{pos.pair.name}</div>
            <div>{parseFloat(pos.liquidityTokenBalance).toFixed(8)}</div>
            <div>{value.toFixed(2)}$</div>
            <button
              className="py-1 text-white bg-pink-500 rounded-full hover:bg-pink-600"
              onClick={() =>
                transferLps(pos.pair.id, parseUnits(pos.liquidityTokenBalance), UNWINDOOOR_ADDR[chainId ? chainId : 1])
              }
            >
              Transfer
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default TransferPairs;
