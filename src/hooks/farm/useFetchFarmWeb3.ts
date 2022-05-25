import { useCallback, useEffect, useState } from 'react';
import { IFarmPosition, MINICHEF_ADDR, queryFarmsWeb3 } from '../../helpers/farm';
import useWeb3 from '../useWeb3';

export default function useFetchFarmsWeb3(account: string | null | undefined): {
  positions: IFarmPosition[];
  loading: boolean;
  fetchFarms: () => Promise<void>;
} {
  const { chainId, provider } = useWeb3();
  const [positions, setPositions]: [any[], Function] = useState([]);
  const [loading, setLoading]: [boolean, Function] = useState(false);

  const fetchFarms = useCallback(async () => {
    if (!provider || !account || !chainId) return;
    if (chainId !== 1 && !MINICHEF_ADDR[chainId]) return;
    setLoading(true);
    setPositions(await queryFarmsWeb3(chainId, account, provider));
    setLoading(false);
  }, [provider, account, chainId]);

  useEffect(() => {
    fetchFarms();
  }, [fetchFarms]);

  return { positions, loading, fetchFarms };
}
