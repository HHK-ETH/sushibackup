import { useCallback, useEffect, useState } from 'react';
import { queryPositions } from '../../helpers/unwindooor';
import useWeb3 from '../useWeb3';

export default function useFetchPositions(account: string | null | undefined) {
  const { chainId } = useWeb3();
  const [loading, setLoading] = useState(false);
  const [positions, setPositions]: [any[], Function] = useState([]);

  const fetchPositions = useCallback(async () => {
    if (!chainId || !account) {
      return;
    }
    setLoading(true);
    setPositions((await queryPositions(account, chainId)).positions);
    setLoading(false);
  }, [account, chainId]);

  useEffect(() => {
    fetchPositions();
  }, [fetchPositions]);

  return { positions, loading, fetchPositions };
}
