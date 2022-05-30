import { useCallback, useEffect, useState } from 'react';
import { queryVault } from '../../helpers/dca';
import { CHAIN_IDS } from '../../helpers/network';
import useWeb3 from '../useWeb3';

export default function useFetchVaults(id: string) {
  const { chainId } = useWeb3();
  const [vault, setVault]: [any, Function] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchVault = useCallback(async () => {
    if (!chainId || chainId !== CHAIN_IDS.POLYGON) {
      return;
    }
    setLoading(true);
    setVault(await queryVault(chainId, id));
    setLoading(false);
  }, [chainId, id]);

  useEffect(() => {
    fetchVault();
  }, [fetchVault]);

  return { vault, loading, fetchVault };
}
