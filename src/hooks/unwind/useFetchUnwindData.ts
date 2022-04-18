import { BigNumber, Contract } from 'ethers';
import { useEffect, useState } from 'react';
import { queryUnwindooorPositions, queryUnwindooorTokens, UNWINDOOOR_ADDR } from '../../helpers/unwindooor';
import { ERC20_ABI, SUSHIMAKER_ABI } from '../../imports/abis';
import { WETH } from '../../imports/tokens';
import useWeb3 from './../useWeb3';

type UnwindData = {
  positions: { totalFees: 0; positions: any[] };
  tokens: { total: 0; tokens: any[] };
  wethBalance: BigNumber;
  isOwner: boolean;
  isTrusted: boolean;
};

export default function useFetchUnwindData(account: string | undefined | null): { data: UnwindData; loading: boolean } {
  const { chainId, provider } = useWeb3();
  const [data, setData]: [data: UnwindData, setdata: Function] = useState({
    positions: { totalFees: 0, positions: [] },
    tokens: { total: 0, tokens: [] },
    wethBalance: BigNumber.from(0),
    isOwner: false,
    isTrusted: false,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!chainId || !UNWINDOOOR_ADDR[chainId] || !provider || !account) return;
      setLoading(true);
      const positions = await queryUnwindooorPositions(chainId);
      const tokens = await queryUnwindooorTokens(chainId);
      const weth = new Contract(WETH[chainId], ERC20_ABI, provider);
      const wethBalance = await weth.balanceOf(UNWINDOOOR_ADDR[chainId]);
      const sushiMaker = new Contract(UNWINDOOOR_ADDR[chainId], SUSHIMAKER_ABI, provider.getSigner());
      const isOwner = (await sushiMaker.owner()) === account;
      const isTrusted = isOwner ? true : await sushiMaker.trusted(account);
      setData({ positions, tokens, wethBalance, isOwner, isTrusted });
      setLoading(false);
    };
    fetchData();
  }, [chainId, provider, account]);

  return { data, loading };
}
