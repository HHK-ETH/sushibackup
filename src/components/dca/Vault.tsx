import { formatUnits } from 'ethers/lib/utils';
import useFetchVault from '../../hooks/dca/useFetchVault';

const Vault = ({ id }: { id: string }): JSX.Element => {
  const { vault, loading } = useFetchVault(id);

  if (loading || vault === null) {
    return <div className="text-center text-white">loading...</div>;
  }

  return (
    <div className="text-center text-white">
      <h1 className="mb-2 text-xl font-semibold">
        Details for vault:{' '}
        <a className="text-pink-500" href={'https://polygonscan.com/address/' + id} target="_blank" rel="noreferrer">
          {id.slice(0, 5) + '...' + id.slice(-5)} &#8599;
        </a>
      </h1>
      <div className="grid grid-cols-2 text-lg">
        <div>
          <h2>Total bought</h2>
          <h2>
            {parseFloat(formatUnits(vault.totalBuy, vault.buyToken.decimals)).toFixed(4)}{' '}
            <span className="text-pink-500">{vault.buyToken.symbol}</span>
          </h2>
          <h2>Average price</h2>
          <h2>
            {(
              parseFloat(formatUnits(vault.totalSell, vault.sellToken.decimals)) /
              parseFloat(formatUnits(vault.totalBuy, vault.buyToken.decimals))
            ).toFixed(4)}{' '}
            <span className="text-pink-500">{vault.sellToken.symbol}</span> per
            <span className="text-pink-500"> {vault.buyToken.symbol}</span>
          </h2>
        </div>
        <div>
          <h2>Total sold</h2>
          <h2>
            {parseFloat(formatUnits(vault.totalSell, vault.sellToken.decimals)).toFixed(4)}{' '}
            <span className="text-pink-500">{vault.sellToken.symbol}</span>
          </h2>
          <h2>Total order executed</h2>
          <h2>
            {vault.executedOrders.length} <span className="text-pink-500">orders</span>
          </h2>
        </div>
      </div>
      <h1 className="mt-4 mb-2 text-xl">Order history (10 most recents):</h1>
      <div className="grid grid-cols-4">
        <div>Tx</div>
        <div>Amount</div>
        <div>Price</div>
        <div>Date</div>
      </div>
      {vault.executedOrders.slice(0, 10).map((order: any) => {
        return (
          <div className="grid grid-cols-4 text-sm">
            <div>
              <a
                className="text-pink-500"
                href={'https://polygonscan.com/tx/' + order.id}
                target="_blank"
                rel="noreferrer"
              >
                {order.id.slice(0, 5) + '...' + order.id.slice(-5)} &#8599;
              </a>
            </div>
            <div>
              {parseFloat(formatUnits(order.amount, vault.buyToken.decimals)).toFixed(4)}{' '}
              <span className="text-pink-500">{vault.buyToken.symbol}</span>
            </div>
            <div>
              {(
                parseFloat(formatUnits(vault.amount, vault.sellToken.decimals)) /
                parseFloat(formatUnits(order.amount, vault.buyToken.decimals))
              ).toFixed(4)}{' '}
              <span className="text-pink-500">{vault.sellToken.symbol}</span>
            </div>
            <div>{((new Date().getTime() / 1000 - order.timestamp) / (3600 * 24)).toFixed(2)} days ago</div>
          </div>
        );
      })}
    </div>
  );
};

export default Vault;
