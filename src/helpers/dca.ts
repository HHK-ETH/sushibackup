import request, { gql } from 'graphql-request';
import { CHAIN_IDS } from './network';

const DCA_FACTORY: { [chainId: number]: string } = {
  [CHAIN_IDS.POLYGON]: '0x17DA2C3D6863eF41D7A5e862fCE164e2563CF51E',
};

const SUBGRAPH_ENDPOINTS: { [chainId: number]: string } = {
  [CHAIN_IDS.POLYGON]: 'https://api.thegraph.com/subgraphs/name/hhk-eth/dca',
};

const QUERY = gql`
  query vaults($owner: ID!) {
    vaults(first: 100, where: { owner: $owner }) {
      id
      buyToken {
        id
        symbol
        decimals
      }
      sellToken {
        id
        symbol
        decimals
      }
      totalBuy
      totalSell
      amount
      balance
      creationTimestamp
      nextExecutableTimestamp
      epochDuration
    }
  }
`;

const QUERY_VAULT_DETAILS = gql`
  query vault($id: ID!) {
    vault(id: $id) {
      buyToken {
        symbol
        decimals
      }
      sellToken {
        symbol
        decimals
      }
      amount
      totalBuy
      totalSell
      executedOrders(orderBy: timestamp, orderDirection: desc) {
        id
        amount
        timestamp
      }
    }
  }
`;

const queryVaults = async (chaindId: number, account: string): Promise<any[]> => {
  const res = await request(SUBGRAPH_ENDPOINTS[chaindId], QUERY, {
    owner: account,
  });
  return res.vaults;
};

const queryVault = async (chainId: number, id: string): Promise<any> => {
  const res = await request(SUBGRAPH_ENDPOINTS[chainId], QUERY_VAULT_DETAILS, {
    id: id,
  });
  return res.vault;
};

//Any token could be used but we display only most used ones to make it simpler.
const DCA_TOKENS: { [chainId: number]: { symbol: string; address: string; priceFeed: string; decimals: number }[] } = {
  [CHAIN_IDS.POLYGON]: [
    {
      symbol: 'USDC',
      address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
      priceFeed: '0xfE4A8cc5b5B2366C1B58Bea3858e81843581b2F7',
      decimals: 6,
    },
    {
      symbol: 'DAI',
      address: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
      priceFeed: '0x4746DeC9e833A82EC7C2C1356372CcF2cfcD2F3D',
      decimals: 18,
    },
    {
      symbol: 'USDT',
      address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
      priceFeed: '0x0A6513e40db6EB1b165753AD52E80663aeA50545',
      decimals: 6,
    },
    {
      symbol: 'WETH',
      address: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
      priceFeed: '0xF9680D99D6C9589e2a93a78A04A279e509205945',
      decimals: 18,
    },
    {
      symbol: 'WBTC',
      address: '0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6',
      priceFeed: '0xDE31F8bFBD8c84b5360CFACCa3539B938dd78ae6',
      decimals: 8,
    },
    {
      symbol: 'WMATIC',
      address: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
      priceFeed: '0xF9680D99D6C9589e2a93a78A04A279e509205945',
      decimals: 18,
    },
    {
      symbol: 'SUSHI',
      address: '0x0b3F868E0BE5597D5DB7fEB59E1CADBb0fdDa50a',
      priceFeed: '0x49B0c695039243BBfEb8EcD054EB70061fd54aa0',
      decimals: 18,
    },
  ],
};

export { DCA_FACTORY, DCA_TOKENS, queryVaults, queryVault };
