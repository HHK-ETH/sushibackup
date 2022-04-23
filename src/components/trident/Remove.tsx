import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { formatUnits, parseUnits } from 'ethers/lib/utils';
import { useState } from 'react';
import { TRIDENT_ROUTER_ADDRESSES } from '../../helpers/trident';
import useFetchMinimumOutCPP from '../../hooks/trident/useFetchMinimumOutCPP';
import useRemoveLiquidityTrident from '../../hooks/trident/useRemoveLiquidityTrident';
import useApprove from '../../hooks/useApprove';
import useFetchAllowance from '../../hooks/useFetchAllowance';
import Modal from '../general/Modal';

const Remove = ({
  position,
  open,
  setOpen,
  fetchTridentPositions,
}: {
  position: any;
  open: boolean;
  setOpen: Function;
  fetchTridentPositions: () => Promise<void>;
}): JSX.Element => {
  const context = useWeb3React<Web3Provider>();
  const { chainId, account } = context;
  const [slippage, setSlippage] = useState(1);
  const { allowance, fetchAllowance } = useFetchAllowance(
    position.pool.id,
    account,
    TRIDENT_ROUTER_ADDRESSES[chainId ? chainId : 1]
  );

  const isApproved = allowance.gte(parseUnits(position.balance, 18)) ? true : false;
  const approveColor = !isApproved ? 'bg-pink-500 hover:bg-pink-600' : 'bg-gray-400';
  const removeColor = isApproved ? 'bg-pink-500 hover:bg-pink-600' : 'bg-gray-400';

  const { minimumOut, loading } = useFetchMinimumOutCPP(position.pool.id, position.balance, slippage);

  const approve = useApprove(
    position.pool.id,
    TRIDENT_ROUTER_ADDRESSES[chainId ? chainId : 1],
    parseUnits(position.balance, 18),
    fetchAllowance
  );
  const removeLiquidity = useRemoveLiquidityTrident(account, position, minimumOut, fetchTridentPositions);

  return (
    <Modal open={open} setOpen={setOpen}>
      <div className="text-center text-white">
        <div className="mb-8">
          <h3 className="mb-4 text-lg">1 - Approve LPs</h3>
          <button onClick={() => approve()} className={'px-8 py-2 font-medium text-white rounded-full ' + approveColor}>
            {isApproved ? 'Already approved' : 'Approve LPs'}
          </button>
        </div>
        <div className="">
          <h3 className="mb-4 text-lg">2 - Remove liquidity</h3>
          <div className="grid grid-cols-2 mb-4">
            <h3>Slippage (in %):</h3>
            <input
              className="text-center text-white bg-indigo-700 rounded-full inline-blockfont-medium text-md"
              type={'number'}
              value={slippage}
              onChange={(e) => {
                let _slippage = parseFloat(e.target.value);
                if (isNaN(_slippage)) _slippage = 0.5;
                if (_slippage > 50) _slippage = 50;
                if (_slippage < 0.1) _slippage = 0.1;
                setSlippage(_slippage);
              }}
            />
          </div>
          {loading ? (
            <p className="mb-4">loading...</p>
          ) : (
            <p className="mb-4">
              Minimum received:{' '}
              {parseFloat(formatUnits(minimumOut.token0, position.pool.assets[0].token.decimals)).toFixed(5)}{' '}
              {position.pool.assets[0].token.symbol} -{' '}
              {parseFloat(formatUnits(minimumOut.token1, position.pool.assets[1].token.decimals)).toFixed(5)}{' '}
              {position.pool.assets[1].token.symbol}.
            </p>
          )}
          <button
            onClick={() => removeLiquidity()}
            className={'px-8 py-2 font-medium text-white rounded-full ' + removeColor}
          >
            Remove liquidity
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default Remove;
