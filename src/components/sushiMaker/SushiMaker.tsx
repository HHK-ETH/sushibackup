import { JsonRpcProvider } from '@ethersproject/providers';
import { Contract } from 'ethers';
import { formatUnits } from 'ethers/lib/utils';
import { useEffect, useState } from 'react';
import { getWethPrice } from '../../helpers/exchange';
import { CHAIN_IDS, NETWORKS } from '../../helpers/network';
import { FEE_TO_LIST } from '../../helpers/sushiMaker';
import { queryPositions } from '../../helpers/unwindooor';
import { WETH } from '../../imports/tokens';
import erc20Abi from './../../imports/abis/erc20.json';

const SushiMaker = (): JSX.Element => {
  const [network, setNetwork]: [network: number, setNetwork: Function] = useState(CHAIN_IDS.ETHEREUM);
  const [fees, setFees]: [fees: [{ address: string; lpValue: number; wethValue: number }], setFees: Function] =
    useState([{ address: '', lpValue: 0, wethValue: 0 }]);

  useEffect(() => {
    const fetchValues = async () => {
      const provider = new JsonRpcProvider(NETWORKS[network].rpc);
      const feesArray = await Promise.all(
        FEE_TO_LIST[network].map(async (address) => {
          const lps = await queryPositions(address, network);
          const weth = new Contract(WETH[network], erc20Abi, provider);
          const wethBalance = formatUnits(await weth.balanceOf(address), 18);
          const wethPrice = await getWethPrice();
          return {
            address: address,
            lpValue: lps.totalFees,
            wethValue: parseFloat(wethBalance) * wethPrice,
          };
        })
      );
      setFees(feesArray);
    };
    fetchValues();
  }, [network]);

  return (
    <div className="container p-16 mx-auto text-center text-white">
      <div className="mb-16">
        <h1 className="text-2xl text-center">Select a chain :</h1>
        {Object.keys(FEE_TO_LIST).map((chainId: any) => {
          let bgColor = chainId === network.toString() ? 'bg-pink-600' : 'bg-pink-500';
          return (
            <button
              className={'px-6 m-4 text-lg font-medium text-white rounded hover:bg-pink-600 ' + bgColor}
              key={chainId}
              onClick={() => {
                setNetwork(chainId);
              }}
            >
              {NETWORKS[chainId].name}
            </button>
          );
        })}
      </div>
      <div>
        {fees.map((recipient) => {
          return (
            <div key={recipient.address} className="grid grid-cols-2 p-16 py-8 bg-indigo-900 rounded-xl">
              <div className="text-md">
                <h2>Address: {recipient.address}</h2>
                <h2>Name: Unknown</h2>
                <h2>LPs value: {recipient.lpValue.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}$</h2>
                <h2>WETH value: {recipient.wethValue.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}$</h2>
              </div>
              <div>
                <h2 className="my-8 text-xl">
                  Total value:{' '}
                  {(recipient.lpValue + recipient.wethValue).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}$
                </h2>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SushiMaker;
