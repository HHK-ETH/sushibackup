import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { Contract, providers } from 'ethers';
import { formatUnits, parseUnits } from 'ethers/lib/utils';
import { useState } from 'react';
import { BENTOBOX_ADDR } from '../../helpers/bentobox';
import { NETWORKS } from '../../helpers/network';
import Modal from '../general/Modal';
import bentoAbi from '../../imports/abis/bento.json';
import dcaAbi from '../../imports/abis/dca.json';

const Withdraw = ({
  open,
  setOpen,
  vault,
  setPending,
}: {
  open: boolean;
  setOpen: Function;
  vault: any;
  setPending: Function;
}): JSX.Element => {
  const context = useWeb3React<Web3Provider>();
  const { chainId, connector, account, deactivate, activate } = context;
  const [amount, setAmount] = useState(0);

  const withdraw = async () => {
    if (!connector || !account || !chainId || vault === null) {
      return;
    }
    const web3Provider = new providers.Web3Provider(await connector.getProvider(), 'any');
    const bento = new Contract(BENTOBOX_ADDR[chainId], bentoAbi, web3Provider.getSigner());
    const dca = new Contract(vault.id, dcaAbi, web3Provider.getSigner());
    const parsedAmount = parseUnits(amount.toString(), vault.sellToken.decimals);
    const shares = await bento.toShare(vault.sellToken.id, parsedAmount, false);
    const tx = await dca.withdraw(shares);
    setPending(NETWORKS[chainId].explorer + 'tx/' + tx.hash);
    await web3Provider.waitForTransaction(tx.hash, 5);
    setPending('');
    deactivate(); //dirty update will refacto
    activate(connector);
    setOpen(false);
  };

  if (vault === null) return <></>;
  return (
    <Modal open={open} setOpen={setOpen}>
      <div className="text-center text-white">
        <h1 className="text-2xl">Withdraw {vault.sellToken.symbol} from the vault</h1>
        <div className="grid grid-cols-3 mt-4">
          <span>Amount :</span>
          <div className="col-span-2 mx-8">
            <input
              className="px-2 text-center text-white bg-indigo-700 rounded-full inline-blockfont-medium text-md"
              type={'number'}
              value={amount}
              onChange={(e) => {
                const value = parseFloat(e.target.value);
                if (value < 0 || isNaN(value)) {
                  setAmount(0);
                  return;
                }
                setAmount(value);
              }}
            />
            <span className="text-sm text-indigo-500">
              Your balance: {parseFloat(formatUnits(vault.balance, vault.sellToken.decimals)).toFixed(4)}{' '}
              {vault.sellToken.symbol}
            </span>
          </div>
        </div>
        {(parseFloat(formatUnits(vault.balance, vault.sellToken.decimals)) >= amount && (
          <>
            <p className="block mt-8">
              Withdraw{' '}
              <span className="font-semibold text-pink-500">
                {amount} {vault.sellToken.symbol}
              </span>{' '}
              to your <span className="font-semibold text-pink-500">Bentobox.</span>
            </p>
            <button
              className={'px-8 py-1 m-2 text-xl text-white bg-pink-500 rounded hover:bg-pink-600 inline-block'}
              onClick={() => withdraw()}
            >
              Withdraw
            </button>
          </>
        )) || <p className="block mt-8">Insufficient balance.</p>}
      </div>
    </Modal>
  );
};

export default Withdraw;
