import { useEffect, useState } from 'react';
import { BENTOBOX_ENDPOINT, queryBentoboxPositions } from '../../helpers/bentobox';
import useWeb3 from '../useWeb3';

export default function useFetchbalances(account: string | undefined | null) {
  const { chainId, provider } = useWeb3();
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBalances = async () => {
      if (!provider || !account || !chainId) return;
      if (!BENTOBOX_ENDPOINT[chainId]) return;
      setLoading(true);
      const pos = await queryBentoboxPositions(chainId, account, provider);
      setPositions(pos === null ? [] : pos);
      setLoading(false);
    };
    fetchBalances();
  }, [chainId, provider, account]);

  return { positions, loading };
}
