const Pairs = (props: { positions: any[]; selectedPairs: any[]; setSelectedPairs: Function }): JSX.Element => {
  return (
    <>
      <div className="grid grid-cols-7 py-8 mt-4 bg-indigo-900 rounded-t-xl">
        <div className="">Pair</div>
        <div className="col-span-2">Token 0</div>
        <div className="col-span-2">Token 1</div>
        <div className="">Value</div>
        <div className="">Select</div>
      </div>
      {props.positions.map((position: any, i: number) => {
        const pair = position.pair;
        const value = (position.liquidityTokenBalance / pair.totalSupply) * pair.reserveUSD;
        const amount0 = (position.liquidityTokenBalance / pair.totalSupply) * pair.reserve0;
        const amount1 = (position.liquidityTokenBalance / pair.totalSupply) * pair.reserve1;
        return (
          <div key={i} className="grid grid-cols-7 py-4 bg-indigo-900 cursor-pointer bg-opacity-60 hover:bg-opacity-75">
            <div className="">{pair.name}</div>
            <div className="col-span-2">{amount0.toFixed(2) + ' ' + pair.token0.symbol}</div>
            <div className="col-span-2">{amount1.toFixed(2) + ' ' + pair.token1.symbol}</div>
            <div className="">{value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}$</div>
            <div>
              <input
                type={'checkbox'}
                onChange={(e) => {
                  const tempPairs = [...props.selectedPairs];
                  if (e.target.checked) {
                    tempPairs.push(pair);
                    props.setSelectedPairs(tempPairs);
                  } else {
                    props.setSelectedPairs(
                      tempPairs.filter((p: any) => {
                        return p.id === pair.id ? false : true;
                      })
                    );
                  }
                }}
                checked={props.selectedPairs.indexOf(pair) !== -1}
              />
            </div>
          </div>
        );
      })}
      ;
    </>
  );
};

export default Pairs;
