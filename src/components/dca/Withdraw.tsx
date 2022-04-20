import { formatUnits } from 'ethers/lib/utils';
import { useState } from 'react';
import Modal from '../general/Modal';
import useWithdrawDca from '../../hooks/dca/useWithdrawDca';

const Withdraw = ({ open, setOpen, vault }: { open: boolean; setOpen: Function; vault: any }): JSX.Element => {
  const [amount, setAmount] = useState(0);
  const withdraw = useWithdrawDca(amount, vault);

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
