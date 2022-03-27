import request, { gql } from 'graphql-request';
import { CHAIN_IDS } from './network';

const TRIDENT_ROUTER_ADDRESSES: { [chainId: number]: string } = {
  [CHAIN_IDS.POLYGON]: '0xc5017BE80b4446988e8686168396289a9A62668E',
};

const SUBGRAPH_ENDPOINTS: { [chainId: number]: string } = {
  [CHAIN_IDS.POLYGON]: 'https://api.thegraph.com/subgraphs/name/sushiswap/trident-polygon',
};

const TRIDENT_POSITIONS_QUERY = gql`
  query positions($user: ID!) {
    liquidityPositions(where: { user: $user }) {
      pool {
        id
        swapFee
        assets {
          token {
            id
            name
            symbol
            decimals
          }
          reserve
        }
        kpi {
          liquidity
        }
      }
      balance
    }
  }
`;

const queryTridentPositions = async (chainId: number, user: string): Promise<any> => {
  const positions = await request(SUBGRAPH_ENDPOINTS[chainId], TRIDENT_POSITIONS_QUERY, {
    user: user.toLowerCase(),
  });
  return positions.liquidityPositions;
};

export { SUBGRAPH_ENDPOINTS, TRIDENT_ROUTER_ADDRESSES, queryTridentPositions };
