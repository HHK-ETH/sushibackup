import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { Contract, providers } from 'ethers';
import { useEffect, useState } from 'react';
import { UNWINDOOOR_ADDR } from '../../helpers/unwindooor';
import sushiMakerAbi from '../../imports/abis/sushiMaker.json';
import { getToken } from '../../imports/tokens';

const Tokens = ({
  tokens,
  selectedTokens,
  setSelectedTokens,
}: {
  tokens: any[];
  selectedTokens: any[];
  setSelectedTokens: Function;
}): JSX.Element => {
  const context = useWeb3React<Web3Provider>();
  const { chainId, connector } = context;
  const [bridges, setBridges] = useState(
    tokens.map((token) => {
      return 'WETH';
    })
  );

  useEffect(() => {
    const fetchBridges = async () => {
      if (!chainId || !connector) {
        return;
      }
      const provider = new providers.Web3Provider(await connector.getProvider(), 'any');
      const sushiMaker = new Contract(UNWINDOOOR_ADDR[chainId], sushiMakerAbi, provider.getSigner());
      setBridges(
        await Promise.all(
          tokens.map(async (token) => {
            const bridge = await sushiMaker.bridges(token.address);
            if (bridge.toLowerCase() === '0x0000000000000000000000000000000000000000') {
              return 'WETH';
            } else {
              const token = getToken(bridge, chainId);
              return token.symbol === 'UT' ? bridge : token.symbol;
            }
          })
        )
      );
    };
    fetchBridges();
  }, [chainId, connector, tokens]);

  return (
    <>
      <div className="grid grid-cols-7 py-6 bg-indigo-800">
        <div className="col-span-3">Token</div>
        <div className="">Bridge</div>
        <div className="">Balance</div>
        <div className="">Value</div>
        <div className="">Select to swap</div>
      </div>
      {tokens.map((token, i) => {
        return (
          <div
            key={token.address}
            className="grid grid-cols-7 py-4 bg-indigo-900 cursor-pointer bg-opacity-60 hover:bg-opacity-75"
          >
            <div className="col-span-3">
              {token.symbol} - {token.address}
            </div>
            <div className="">{bridges[i]}</div>
            <div className="">{parseFloat(token.balance).toFixed(4)}</div>
            <div className="">
              {parseFloat(token.balanceUSD)
                .toFixed(2)
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}{' '}
              $
            </div>
            <div className="">
              <input
                type={'checkbox'}
                onChange={(e) => {
                  const selected = [...selectedTokens];
                  if (e.target.checked) {
                    selected.push(token);
                    setSelectedTokens(selected);
                  } else {
                    setSelectedTokens(
                      selected.filter((_token: any) => {
                        return token.address !== _token.address;
                      })
                    );
                  }
                }}
                checked={selectedTokens.find((_token: any) => {
                  return token.address === _token.address;
                })}
              />
            </div>
          </div>
        );
      })}
    </>
  );
};

export default Tokens;
