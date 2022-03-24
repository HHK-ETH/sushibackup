import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';

const Trident = (): JSX.Element => {
  const context = useWeb3React<Web3Provider>();
  const { active, chainId, connector, account } = context;
  return <div>Trident</div>;
};

export default Trident;
