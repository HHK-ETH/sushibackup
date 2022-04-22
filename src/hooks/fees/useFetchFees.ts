import { useEffect, useState } from 'react';
import { FEE_TO_LIST } from '../../helpers/sushiMaker';
import { queryPositions, queryTokensZapper } from '../../helpers/unwindooor';

export default function useFetchFees(network: number): { fees: any[]; total: number; loading: boolean } {
  const [fees, setFees]: [fees: [{ address: string; lpsValue: number; tokensValue: number }], setFees: Function] =
    useState([{ address: '', lpsValue: 0, tokensValue: 0 }]);
  const [loading, setLoading]: [loading: boolean, setLoading: Function] = useState(false);
  const [total, setTotal]: [total: number, setTotal: Function] = useState(0);

  useEffect(() => {
    const fetchValues = async () => {
      setLoading(true);
      let _total = 0;
      const feesArray = await Promise.all(
        FEE_TO_LIST[network].map(async (address) => {
          const lps = await queryPositions(address, network);
          const tokens = await queryTokensZapper(address, network);
          _total += lps.totalFees + tokens.total;
          return {
            address: address,
            lpsValue: lps.totalFees,
            tokensValue: tokens.total,
          };
        })
      );
      setFees(feesArray);
      setTotal(_total);
      setLoading(false);
    };
    fetchValues();
  }, [network]);

  return { fees, total, loading };
}
