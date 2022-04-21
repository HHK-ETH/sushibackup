import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { BigNumber, Contract, providers } from 'ethers';
import { parseUnits } from 'ethers/lib/utils';
import { useEffect, useState } from 'react';
import { TRIDENT_ROUTER_ADDRESSES } from '../../helpers/trident';
import useRemoveLiquidityTrident from '../../hooks/trident/useRemoveLiquidityTrident';
import useApprove from '../../hooks/useApprove';
import Modal from '../general/Modal';
import erc20ABI from './../../imports/abis/erc20.json';

const Remove = ({ position, open, setOpen }: { position: any; open: boolean; setOpen: Function }): JSX.Element => {
  const context = useWeb3React<Web3Provider>();
  const { chainId, connector, account } = context;
  const [slippage, setSlippage] = useState(1);
  const [allowance, setAllowance] = useState(BigNumber.from(0));

  useEffect(() => {
    const fetchInfos = async () => {
      if (!connector || !account || !chainId) {
        return;
      }
      const provider = new providers.Web3Provider(await connector.getProvider(), 'any');
      const lpContract = new Contract(position.pool.id, erc20ABI, provider);
      setAllowance(await lpContract.allowance(account, TRIDENT_ROUTER_ADDRESSES[chainId]));
    };
    fetchInfos();
  }, [connector, account, chainId, position.pool.id]);

  const isApproved = allowance.gte(parseUnits(position.balance, 18)) ? true : false;
  const approveColor = !isApproved ? 'bg-pink-500 hover:bg-pink-600' : 'bg-gray-400';

  const tokensToBeReceived = [
    (position.balance / position.pool.kpi.liquidity) * position.pool.assets[0].reserve * (1 - slippage / 100),
    (position.balance / position.pool.kpi.liquidity) * position.pool.assets[1].reserve * (1 - slippage / 100),
  ];

  const approve = useApprove(
    position.pool.id,
    TRIDENT_ROUTER_ADDRESSES[chainId ? chainId : 1],
    parseUnits(position.balance, 18)
  );
  const removeLiquidity = useRemoveLiquidityTrident(account, position, tokensToBeReceived);

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
          <p className="mb-4">
            Minimum received: {tokensToBeReceived[0].toFixed(5)} {position.pool.assets[0].token.symbol} -{' '}
            {tokensToBeReceived[1].toFixed(5)} {position.pool.assets[1].token.symbol}.
          </p>
          <button
            onClick={() => removeLiquidity()}
            className="px-8 py-2 font-medium text-white bg-pink-500 rounded-full hover:bg-pink-600"
          >
            Remove liquidity
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default Remove;
