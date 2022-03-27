import { Web3Provider } from '@ethersproject/providers';
import { Dialog, Transition } from '@headlessui/react';
import { useWeb3React } from '@web3-react/core';
import { BigNumber, Contract, providers } from 'ethers';
import { AbiCoder, parseUnits } from 'ethers/lib/utils';
import { Fragment, useEffect, useState } from 'react';
import { NETWORKS } from '../../helpers/network';
import { TRIDENT_ROUTER_ADDRESSES } from '../../helpers/trident';
import erc20ABI from './../../imports/abis/erc20.json';
import tridentABI from './../../imports/abis/trident.json';

const Remove = ({
  position,
  open,
  setOpen,
  setTxPending,
}: {
  position: any;
  open: boolean;
  setOpen: Function;
  setTxPending: Function;
}): JSX.Element => {
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        static
        className="fixed inset-0 z-10 overflow-y-auto"
        open={open}
        // @ts-ignore
        onClose={setOpen}
      >
        <div className="flex items-end justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="inline-block w-full overflow-hidden text-left align-bottom transition-all transform bg-indigo-900 rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg">
              <div className="px-4 pt-5 pb-4 bg-indigo-900 sm:p-6 sm:pb-4">
                <RemoveForm setTxPending={setTxPending} position={position} setOpen={setOpen} />
              </div>
              <div className="px-4 py-4 text-right bg-indigo-900">
                <button
                  type="button"
                  className="px-8 py-2 text-white bg-pink-500 rounded-full hover:bg-pink-600 text-md"
                  onClick={() => setOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

const RemoveForm = ({
  position,
  setTxPending,
  setOpen,
}: {
  position: any;
  setTxPending: Function;
  setOpen: Function;
}): JSX.Element => {
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

  const approve = async () => {
    if (isApproved || !connector || !account || !chainId) {
      return;
    }
    const provider = new providers.Web3Provider(await connector.getProvider(), 'any');
    const lpContract = new Contract(position.pool.id, erc20ABI, provider).connect(provider.getSigner());
    const tx = await lpContract.approve(TRIDENT_ROUTER_ADDRESSES[chainId], parseUnits(position.balance, 18));
    setTxPending(NETWORKS[chainId].explorer + 'tx/' + tx.hash);
    await provider.waitForTransaction(tx.hash, 1);
    setTxPending('');
    setAllowance(await lpContract.allowance(account, TRIDENT_ROUTER_ADDRESSES[chainId]));
  };

  const removeLiquidity = async () => {
    if (!isApproved || !connector || !account || !chainId) {
      return;
    }
    const provider = new providers.Web3Provider(await connector.getProvider(), 'any');
    const tridentContract = new Contract(TRIDENT_ROUTER_ADDRESSES[chainId], tridentABI, provider).connect(
      provider.getSigner()
    );
    const tx = await tridentContract.burnLiquidity(
      position.pool.id,
      parseUnits(position.balance, 18),
      new AbiCoder().encode(['address', 'bool'], [account, true]),
      [
        {
          token: position.pool.assets[0].token.id,
          amount: parseUnits(tokensToBeReceived[0].toFixed(18), position.pool.assets[0].token.decimals),
        },
        {
          token: position.pool.assets[1].token.id,
          amount: parseUnits(tokensToBeReceived[1].toFixed(18), position.pool.assets[1].token.decimals),
        },
      ]
    );
    setTxPending(NETWORKS[chainId].explorer + 'tx/' + tx.hash);
    await provider.waitForTransaction(tx.hash, 1);
    setTxPending('');
    setOpen(false);
  };

  return (
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
  );
};

export default Remove;
