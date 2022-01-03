import { useState } from 'react';
import ConnectModal from '../wallet/ConnectModal';
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { NETWORKS } from '../../helpers/network';
import sushiLogo from './../../imports/images/sushi.png';
import { Link } from 'react-router-dom';

const Header = (): JSX.Element => {
  const context = useWeb3React<Web3Provider>();
  const { account, active, chainId } = context;
  const connectBtnLabel =
    active && account
      ? account.slice(0, 5) + '***' + account?.slice(account.length - 5, account.length)
      : 'Connect wallet';
  const [open, setOpen] = useState(false);

  return (
    <>
      <ConnectModal open={open} setOpen={setOpen} />
      <nav className="p-6 mb-6">
        <Link className="float-left -mt-2 text-white text-md" to={'/'}>
          <img className={'h-10 inline-block mr-2'} alt={'chain-logo'} src={sushiLogo} /> Home
        </Link>
        <button
          className="float-right px-12 text-lg font-medium text-white bg-pink-500 rounded hover:bg-pink-600 focus:outline-none"
          onClick={() => setOpen(true)}
        >
          {chainId && (
            <img className={'h-6 inline-block mr-4 -ml-4 -mt-1 py-1'} alt={'chain-logo'} src={NETWORKS[chainId].logo} />
          )}
          {connectBtnLabel}
        </button>
      </nav>
    </>
  );
};

export default Header;
