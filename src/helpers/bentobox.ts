import { Web3Provider } from '@ethersproject/providers';
import { Contract } from 'ethers';
import { request, gql } from 'graphql-request';
import { CHAIN_IDS } from './network';
import bentoBoxABI from '../imports/abis/bento.json';

const QUERY = gql`
  query queryBentobox($address: ID!) {
    user(id: $address) {
      tokens {
        token {
          name
          symbol
          id
          decimals
        }
        share
      }
    }
  }
`;

const BENTOBOX_ENDPOINT: { [chainId: number]: string } = {
  [CHAIN_IDS.ARBITRUM]: 'https://api.thegraph.com/subgraphs/name/sushiswap/arbitrum-bentobox',
  [CHAIN_IDS.ETHEREUM]: 'https://api.thegraph.com/subgraphs/name/sushiswap/bentobox',
  [CHAIN_IDS.XDAI]: 'https://api.thegraph.com/subgraphs/name/sushiswap/xdai-bentobox',
  [CHAIN_IDS.BSC]: 'https://api.thegraph.com/subgraphs/name/sushiswap/bsc-bentobox',
  [CHAIN_IDS.POLYGON]: 'https://api.thegraph.com/subgraphs/name/sushiswap/matic-bentobox',
};

const BENTOBOX_ADDR: { [chainId: number]: string } = {
  [CHAIN_IDS.ETHEREUM]: '0xf5bce5077908a1b7370b9ae04adc565ebd643966',
  [CHAIN_IDS.ARBITRUM]: '0x74c764D41B77DBbb4fe771daB1939B00b146894A',
  [CHAIN_IDS.BSC]: '0xf5bce5077908a1b7370b9ae04adc565ebd643966',
  [CHAIN_IDS.POLYGON]: '0x0319000133d3ada02600f0875d2cf03d442c3367',
  [CHAIN_IDS.XDAI]: '0xE2d7F5dd869Fc7c126D21b13a9080e75a4bDb324',
};

const queryBentoboxPositions = async (chainId: number, address: string, web3provider: Web3Provider): Promise<any> => {
  const positions = (await request(BENTOBOX_ENDPOINT[chainId], QUERY, { address: address.toLowerCase() })).user;
  if (positions === null) return null;
  const bentobox = new Contract(BENTOBOX_ADDR[chainId], bentoBoxABI, web3provider);
  return await Promise.all(
    positions.tokens
      .filter((pos: any) => pos.share !== '0')
      .map(async (pos: any) => {
        pos.amount = await bentobox.toAmount(pos.token.id, pos.share, false);
        return pos;
      })
  );
};

export { BENTOBOX_ENDPOINT, BENTOBOX_ADDR, queryBentoboxPositions };
