import useFetchUnwindbridges from '../../hooks/unwind/useFetchUnwindBridges';

const Tokens = ({
  tokens,
  selectedTokens,
  setSelectedTokens,
}: {
  tokens: any[];
  selectedTokens: any[];
  setSelectedTokens: Function;
}): JSX.Element => {
  const { bridges, loading } = useFetchUnwindbridges(tokens);

  return (
    <>
      <div className="grid grid-cols-7 py-6 bg-indigo-800">
        <div className="col-span-3">Token</div>
        <div className="">Bridge</div>
        <div className="">Balance</div>
        <div className="">Value</div>
        <div className="">Select to swap</div>
      </div>
      {tokens
        .filter((token) => {
          return token.symbol !== 'WETH';
        })
        .map((token, i) => {
          return (
            <div
              key={token.address}
              className="grid grid-cols-7 py-4 bg-indigo-900 cursor-pointer bg-opacity-60 hover:bg-opacity-75"
            >
              <div className="col-span-3">
                {token.symbol} - {token.address}
              </div>
              <div className="">{loading ? 'loading...' : bridges[i]}</div>
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
