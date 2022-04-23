import { BigNumber, Contract } from 'ethers';
import { useEffect, useState } from 'react';
import { BENTOBOX_ADDR } from '../../helpers/bentobox';
import { BENTO_ABI, ERC20_ABI } from '../../imports/abis';
import useWeb3 from '../useWeb3';

type FetchDepositBalancesReturn = {
  balance: BigNumber;
  allowance: BigNumber;
  loading: boolean;
};

export default function useFetchDepositBalance(
  account: string | null | undefined,
  vault: any,
  fromWallet: boolean
): FetchDepositBalancesReturn {
  const { chainId, provider } = useWeb3();
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState(BigNumber.from(0));
  const [allowance, setAllowance] = useState(BigNumber.from(0));

  useEffect(() => {
    const fetchBalance = async () => {
      if (!provider || !account || !chainId || vault === null) {
        return;
      }
      setLoading(true);
      if (fromWallet) {
        const erc20 = new Contract(vault.sellToken.id, ERC20_ABI, provider);
        setBalance(await erc20.balanceOf(account));
        setAllowance(await erc20.allowance(account, BENTOBOX_ADDR[chainId]));
      } else {
        const bento = new Contract(BENTOBOX_ADDR[chainId], BENTO_ABI, provider);
        const shares = await bento.balanceOf(vault.sellToken.id, account);
        setBalance(await bento.toAmount(vault.sellToken.id, shares, false));
      }
      setLoading(false);
    };
    fetchBalance();
  }, [account, chainId, provider, vault, fromWallet]);

  return { balance, allowance, loading };
}
