import { Contract } from 'ethers';
import { useEffect, useState } from 'react';
import { UNWINDOOOR_ADDR } from '../../helpers/unwindooor';
import { SUSHIMAKER_ABI } from '../../imports/abis';
import { getToken } from '../../imports/tokens';
import useWeb3 from './../useWeb3';

export default function useFetchUnwindbridges(tokens: any[]): { bridges: string[]; loading: boolean } {
  const { chainId, provider } = useWeb3();
  const [bridges, setBridges] = useState(
    tokens.map(() => {
      return 'WETH';
    })
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBridges = async () => {
      if (!chainId || !provider) {
        return;
      }
      setLoading(true);
      const sushiMaker = new Contract(UNWINDOOOR_ADDR[chainId], SUSHIMAKER_ABI, provider.getSigner());
      setBridges(
        await Promise.all(
          tokens.map(async (token) => {
            const bridge = await sushiMaker.bridges(token.address);
            if (bridge.toLowerCase() === '0x0000000000000000000000000000000000000000') {
              return 'WETH';
            } else {
              const token = getToken(bridge, chainId);
              return token.symbol === 'UT' ? bridge : token.symbol;
            }
          })
        )
      );
      setLoading(false);
    };
    fetchBridges();
  }, [chainId, provider, tokens]);

  return { bridges, loading };
}
