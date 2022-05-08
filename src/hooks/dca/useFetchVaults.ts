import { useCallback, useEffect, useState } from 'react';
import { queryVaults } from '../../helpers/dca';
import { CHAIN_IDS } from '../../helpers/network';
import useWeb3 from '../useWeb3';

export default function useFetchVaults(account: string | null | undefined) {
  const { chainId } = useWeb3();
  const [vaults, setVaults]: [any[], Function] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchVaults = useCallback(async () => {
    if (!chainId || !account || chainId !== CHAIN_IDS.POLYGON) {
      return;
    }
    setLoading(true);
    setVaults(await queryVaults(chainId, account));
    setLoading(false);
  }, [chainId, account]);

  useEffect(() => {
    fetchVaults();
  }, [fetchVaults]);

  return { vaults, loading, fetchVaults };
}
