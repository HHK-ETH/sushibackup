const Tokens = ({ tokens }: { tokens: any[] }): JSX.Element => {
  console.log(tokens);
  return (
    <>
      <div className="grid grid-cols-5 py-6 bg-indigo-800">
        <div className="">Token</div>
        <div className="">Bridge</div>
        <div className="">Balance</div>
        <div className="">Value</div>
        <div className="">Select to swap</div>
      </div>
      {tokens.map((token) => {
        return (
          <div
            key={token.address}
            className="grid grid-cols-5 py-4 bg-indigo-900 cursor-pointer bg-opacity-60 hover:bg-opacity-75"
          >
            <div className="">{token.symbol}</div>
            <div className="">WETH</div>
            <div className="">{parseFloat(token.balance).toFixed(4)}</div>
            <div className="">
              {parseFloat(token.balanceUSD)
                .toFixed(2)
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}{' '}
              $
            </div>
            <div className="">
              <input type={'checkbox'} onChange={(e) => {}} checked={false} />
            </div>
          </div>
        );
      })}
    </>
  );
};

export default Tokens;
