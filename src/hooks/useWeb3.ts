import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { providers } from 'ethers';
import { useEffect, useState } from 'react';

export default function useWeb3() {
  const context = useWeb3React<Web3Provider>();
  const { connector, chainId } = context;
  const [web3, setWeb3]: [
    web3: { chainId: number | undefined; provider: Web3Provider | undefined },
    setWeb3: Function
  ] = useState({ chainId: chainId, provider: undefined });

  useEffect(() => {
    async function getProvider() {
      if (!connector) return;
      const provider = new providers.Web3Provider(await connector.getProvider(), 'any');
      setWeb3({ chainId: chainId, provider: provider });
    }
    getProvider();
  }, [connector, chainId]);

  return web3;
}
