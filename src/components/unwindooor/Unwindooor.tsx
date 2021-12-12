import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { providers } from 'ethers';
import { useEffect, useState } from 'react';
import { PRODUCTS, PRODUCT_IDS } from '../../helpers/products';
import { getAllpairs, IPairData } from '../../helpers/sushiMaker';
import { ApolloClient, InMemoryCache, ApolloProvider, useQuery, gql } from '@apollo/client';
import { NETWORKS } from '../../helpers/network';

const defaultClient = new ApolloClient({
  uri: NETWORKS[1].exchangeSubgraph,
  cache: new InMemoryCache(),
});

const getQuery = (feeTo: string) => {
  return gql`
    query positions {
      users(first: 1, where: { id: "${feeTo.toLocaleLowerCase()}" }) {
        lp1: liquidityPositions(first: 1000, orderBy: timestamp, orderDirection: desc) {
          pair {
            id
            reserveUSD
            totalSupply
            name
            token0 {
              name
            }
            token1 {
              name
            }
          }
          liquidityTokenBalance
        }
        lp2: liquidityPositions(skip: 1000, first: 1000, orderBy: timestamp, orderDirection: desc) {
          pair {
            id
            reserveUSD
            totalSupply
            name
            token0 {
              name
            }
            token1 {
              name
            }
          }
          liquidityTokenBalance
        }
      }
    }
  `;
};

const Unwindooor = (): JSX.Element => {
  const context = useWeb3React<Web3Provider>();
  const { active, chainId } = context;
  const [totalFees, setTotalFess]: [number, Function] = useState(0);
  const [client, setClient] = useState(defaultClient);
  const { loading, error, data } = useQuery(
    getQuery(
      chainId ? PRODUCTS[PRODUCT_IDS.UNWINDOOOR].networks[chainId] : PRODUCTS[PRODUCT_IDS.UNWINDOOOR].networks[1]
    ),
    {
      client: client,
    }
  );
  const [selectedPairs, setSelectedPairs]: [any[], Function] = useState([]);
  const [openModal, setOpenModal]: [boolean, Function] = useState(false);

  useEffect(() => {
    if (active && chainId && NETWORKS[chainId]) {
      setClient(
        new ApolloClient({
          uri: NETWORKS[chainId].exchangeSubgraph,
          cache: new InMemoryCache(),
        })
      );
      setSelectedPairs([]);
    }
  }, [active, chainId]);

  useEffect(() => {
    if (data) {
      let fees = 0;
      [...data.users[0].lp1, ...data.users[0].lp2].forEach((position: any) => {
        const pair = position.pair;
        const value = (position.liquidityTokenBalance / pair.totalSupply) * pair.reserveUSD;
        fees += value;
      });
      setTotalFess(fees);
    }
  }, [data]);

  if (chainId && !PRODUCTS[PRODUCT_IDS.SUSHI_MAKER].networks[chainId]) {
    return <div className={'mt-24 text-xl text-center text-white'}>Unwindooor is not available on this network.</div>;
  }
  if (loading) return <div className="container p-16 mx-auto text-center text-white">Loading data...</div>;
  if (error) return <div className="container p-16 mx-auto text-center text-white">Subgraph returned an error.</div>;

  return (
    <div className="container p-16 mx-auto text-center text-white">
      <h1 className="text-xl">Total fees available: {totalFees.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}$</h1>
      {loading && <div className={'text-white'}>loading data...</div>}
      {selectedPairs.length > 0 && (
        <button
          className="float-right px-12 text-lg font-medium text-white bg-pink-500 rounded hover:bg-pink-600 focus:outline-none"
          onClick={() => setOpenModal(true)}
        >
          {}
        </button>
      )}
      <div className="grid grid-cols-7 py-8 bg-indigo-900 rounded-t-xl">
        <div className="">Pair</div>
        <div className="col-span-2">Token A</div>
        <div className="col-span-2">Token B</div>
        <div className="">Value</div>
        <div className="">Select</div>
      </div>
      {[...data.users[0].lp1, ...data.users[0].lp2]
        .sort((positionA: any, positionB: any) => {
          const pairA = positionA.pair;
          const valueA = (positionA.liquidityTokenBalance / pairA.totalSupply) * pairA.reserveUSD;
          const pairB = positionB.pair;
          const valueB = (positionB.liquidityTokenBalance / pairB.totalSupply) * pairB.reserveUSD;
          if (valueA > valueB) return -1;
          return +1;
        })
        .map((position: any, i: number) => {
          const pair = position.pair;
          const value = (position.liquidityTokenBalance / pair.totalSupply) * pair.reserveUSD;
          return (
            <div
              key={i}
              className="grid grid-cols-7 py-4 bg-indigo-900 cursor-pointer bg-opacity-60 hover:bg-opacity-75"
            >
              <div className="">{pair.name}</div>
              <div className="col-span-2">{pair.token0.name}</div>
              <div className="col-span-2">{pair.token1.name}</div>
              <div className="">{value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}$</div>
              <div>
                <input
                  type={'checkbox'}
                  onChange={(e) => {
                    const tempPairs = [...selectedPairs];
                    if (e.target.checked) {
                      tempPairs.push(pair.id);
                      setSelectedPairs(tempPairs);
                    } else {
                      setSelectedPairs(
                        tempPairs.filter((id: string) => {
                          return id === pair.id ? false : true;
                        })
                      );
                    }
                  }}
                  checked={selectedPairs.indexOf(pair.id) !== -1}
                />
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default Unwindooor;
