import { BigNumber } from 'ethers';
import { useCallback, useEffect, useState } from 'react';
import { BENTOBOX_ADDR, queryBentoboxPositionWeb3 } from '../../helpers/bentobox';
import useWeb3 from '../useWeb3';

export default function useFetchbalances(account: string | undefined | null, address: string) {
  const { chainId, provider } = useWeb3();
  const [position, setPosition] = useState({
    symbol: 'Unknown',
    decimals: BigNumber.from(18),
    balance: BigNumber.from(0),
    share: BigNumber.from(0),
  });
  const [loading, setLoading] = useState(false);

  const findPosition = useCallback(async () => {
    if (!provider || !account || !chainId) return;
    if (!BENTOBOX_ADDR[chainId] || address.length !== 42) return;
    setLoading(true);
    const pos = await queryBentoboxPositionWeb3(chainId, account, address, provider);
    if (pos !== null) {
      setPosition(pos);
    }
    setLoading(false);
  }, [chainId, provider, account, address]);

  useEffect(() => {
    findPosition();
  }, [findPosition]);

  return { position, loading, findPosition };
}
