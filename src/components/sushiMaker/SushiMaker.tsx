import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { providers } from 'ethers';
import { useEffect, useState } from 'react';
import { PRODUCTS, PRODUCT_IDS } from '../../helpers/products';
import { getAllpairs, IPairData } from './../../helpers/sushiMaker';

export function SushiMaker(): JSX.Element {
  const context = useWeb3React<Web3Provider>();
  const { active, chainId, connector } = context;
  const [loading, setLoading]: [boolean, Function] = useState(false);
  const [pairs, setPairs]: [IPairData[], Function] = useState([]);
  const [totalFees, setTotalFees]: [number, Function] = useState(0);

  useEffect(() => {
    async function fetchPairs() {
      if (!connector || !chainId) return;
      setLoading(true);
      const web3Provider = new providers.Web3Provider(await connector.getProvider(), 'any');
      const tempAllPairs = (await getAllpairs(web3Provider, chainId)).sort((pairA, pairB) => {
        if (pairA.value > pairB.value) return -1;
        return +1;
      });
      let tempTotalFees = 0;
      tempAllPairs.forEach((pair) => {
        tempTotalFees += pair.value;
      });
      setPairs(tempAllPairs);
      setTotalFees(tempTotalFees);
      setLoading(false);
    }
    fetchPairs();
  }, [active, chainId, connector]);

  if (!active) {
    return <div className="text-xl text-center text-white">Please connect your wallet.</div>;
  }
  if (chainId && !PRODUCTS[PRODUCT_IDS.SUSHI_MAKER].networks[chainId]) {
    return <div className={'mt-24 text-xl text-center text-white'}>Kashi is not available on this network.</div>;
  }

  return (
    <div className="container p-16 mx-auto text-center text-white">
      <h1 className="text-xl">Total fees available: {totalFees.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}$</h1>
      {loading && <div className={'text-white'}>loading data...</div>}
      <div className="grid grid-cols-6 py-8 bg-indigo-900 rounded-t-xl">
        <div className="">Pair</div>
        <div className="col-span-2">Token A</div>
        <div className="col-span-2">Token B</div>
        <div className="">Value</div>
      </div>
      {pairs.map((pair, i) => {
        return (
          <div key={i} className="grid grid-cols-6 py-4 bg-indigo-900 cursor-pointer bg-opacity-60 hover:bg-opacity-75">
            <div className="">{pair.name}</div>
            <div className="col-span-2">{pair.tokenA}</div>
            <div className="col-span-2">{pair.tokenB}</div>
            <div className="">{pair.value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}$</div>
          </div>
        );
      })}
    </div>
  );
}
