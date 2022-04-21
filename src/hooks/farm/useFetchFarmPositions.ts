import { useEffect, useState } from 'react';
import { IFarmPosition, MINICHEF_ADDR, queryFarmPositions } from '../../helpers/farm';
import useWeb3 from '../useWeb3';

export default function useFetchFarmPositions(account: string | null | undefined): {
  positions: IFarmPosition[];
  loading: boolean;
} {
  const { chainId, provider } = useWeb3();
  const [positions, setPositions]: [IFarmPosition[], Function] = useState([]);
  const [loading, setLoading]: [boolean, Function] = useState(false);

  useEffect(() => {
    const fetchFarms = async () => {
      if (!provider || !account || !chainId) return;
      if (chainId !== 1 && !MINICHEF_ADDR[chainId]) return;
      setLoading(true);
      setPositions(await queryFarmPositions(chainId, account, provider));
      setLoading(false);
    };
    fetchFarms();
  }, [provider, chainId, account]);

  return { positions, loading };
}
