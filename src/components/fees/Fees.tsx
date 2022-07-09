import { useState } from 'react';
import { CHAIN_IDS, NETWORKS } from '../../helpers/network';
import { FEE_TO_LIST, getAddressLabel } from '../../helpers/sushiMaker';
import useFetchFees from '../../hooks/fees/useFetchFees';
import zapper from './../../imports/images/products/zapper.svg';

const SushiMaker = (): JSX.Element => {
  const [network, setNetwork]: [network: number, setNetwork: Function] = useState(CHAIN_IDS.ETHEREUM);
  const { fees, total, loading } = useFetchFees(network);

  if (loading) {
    return (
      <div className="text-center text-white">
        Loading data...{' '}
        <div className="absolute bottom-0 left-0">
          <img src={zapper} alt="zapper" width={'200px'} />
        </div>
      </div>
    );
  }

  return (
    <div className="container p-16 mx-auto text-center text-white">
      <div className="mb-16">
        <h1 className="text-2xl text-center">Select a chain :</h1>
        {Object.keys(FEE_TO_LIST).map((chainId: any) => {
          let bgColor = chainId === network.toString() ? 'bg-pink-600' : 'bg-pink-500';
          return (
            <button
              className={'px-6 m-2 text-lg font-medium text-white rounded hover:bg-pink-600 ' + bgColor}
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
        <h1 className="text-2xl">
          Total fees available on this chain : {total.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}$
        </h1>
        {fees.map((recipient) => {
          return (
            <div
              key={recipient.address}
              className="grid py-4 my-4 break-all bg-indigo-900 md:p-12 lg:grid-cols-2 sm:grid-cols-1 rounded-xl"
            >
              <div className="sm:text-sm md:text-lg">
                <h2>Address: {recipient.address}</h2>
                <h2>Label: {getAddressLabel(network, recipient.address)}</h2>
                <h2>LPs value: {recipient.lpsValue.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}$</h2>
                <h2>Tokens value: {recipient.tokensValue.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}$</h2>
              </div>
              <div>
                <h2 className="my-12 sm:text-lg md:text-2xl">
                  Total value:{' '}
                  {(recipient.lpsValue + recipient.tokensValue).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}$
                </h2>
              </div>
            </div>
          );
        })}
        <p className="mt-16">
          Address labeling using{' '}
          <a
            className="underline"
            href="https://boringcrypto.github.io/DAOView/#/multisigs"
            target="_blank"
            rel="noreferrer"
          >
            BoringCrypto DAO VIEW
          </a>
        </p>
      </div>
      <div className="absolute bottom-0 left-0">
        <img src={zapper} alt="zapper" width={'200px'} />
      </div>
    </div>
  );
};

export default SushiMaker;
