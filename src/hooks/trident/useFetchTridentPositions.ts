import { useCallback, useEffect, useState } from 'react';
import { queryTridentPositions, SUBGRAPH_ENDPOINTS } from '../../helpers/trident';
import useWeb3 from '../useWeb3';

export default function useFetchTridentPositions(account: string | null | undefined) {
  const { chainId } = useWeb3();
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTridentPositions = useCallback(async () => {
    if (!account || !chainId || !SUBGRAPH_ENDPOINTS[chainId]) {
      return;
    }
    setLoading(true);
    setPositions(
      (await queryTridentPositions(chainId, account)).filter((position: any) => {
        return position.balance > 0;
      })
    );
    setLoading(false);
  }, [account, chainId]);

  useEffect(() => {
    fetchTridentPositions();
  }, [fetchTridentPositions]);

  return { positions, loading, fetchTridentPositions };
}
