import { Web3Provider } from '@ethersproject/providers';
import { Contract } from 'ethers';
import { request, gql } from 'graphql-request';
import { CHAIN_IDS } from './network';
import bentoBoxABI from '../imports/abis/bento.json';
import { parseUnits } from 'ethers/lib/utils';
import { BENTO_ABI, ERC20_ABI } from '../imports/abis';

const QUERY = gql`
  query queryBentobox($address: ID!) {
    userTokens(where: { user: $address }, first: 100) {
      token {
        id
        symbol
        decimals
        name
      }
      share
    }
  }
`;

const BENTOBOX_ENDPOINT: { [chainId: number]: string } = {
  [CHAIN_IDS.ARBITRUM]: 'https://api.thegraph.com/subgraphs/name/matthewlilley/bentobox-arbitrum',
  [CHAIN_IDS.ETHEREUM]: 'https://api.thegraph.com/subgraphs/name/matthewlilley/bentobox-ethereum',
  [CHAIN_IDS.XDAI]: 'https://api.thegraph.com/subgraphs/name/matthewlilley/bentobox-gnosis',
  [CHAIN_IDS.BSC]: 'https://api.thegraph.com/subgraphs/name/matthewlilley/bentobox-bsc',
  [CHAIN_IDS.POLYGON]: 'https://api.thegraph.com/subgraphs/name/matthewlilley/bentobox-polygon',
  [CHAIN_IDS.AVALANCHE]: 'https://api.thegraph.com/subgraphs/name/matthewlilley/bentobox-avalanche',
  [CHAIN_IDS.FANTOM]: 'https://api.thegraph.com/subgraphs/name/matthewlilley/bentobox-fantom',
};

const BENTOBOX_ADDR: { [chainId: number]: string } = {
  [CHAIN_IDS.ETHEREUM]: '0xf5bce5077908a1b7370b9ae04adc565ebd643966',
  [CHAIN_IDS.ARBITRUM]: '0x74c764D41B77DBbb4fe771daB1939B00b146894A',
  [CHAIN_IDS.BSC]: '0xf5bce5077908a1b7370b9ae04adc565ebd643966',
  [CHAIN_IDS.POLYGON]: '0x0319000133d3ada02600f0875d2cf03d442c3367',
  [CHAIN_IDS.XDAI]: '0xE2d7F5dd869Fc7c126D21b13a9080e75a4bDb324',
  [CHAIN_IDS.AVALANCHE]: '0x0711b6026068f736bae6b213031fce978d48e026',
  [CHAIN_IDS.FANTOM]: '0xf5bce5077908a1b7370b9ae04adc565ebd643966',
};

const queryBentoboxPositions = async (chainId: number, address: string, web3provider: Web3Provider): Promise<any> => {
  const positions = (await request(BENTOBOX_ENDPOINT[chainId], QUERY, { address: address.toLowerCase() })).userTokens;
  if (positions === null) return null;
  const bentobox = new Contract(BENTOBOX_ADDR[chainId], bentoBoxABI, web3provider);
  return await Promise.all(
    positions
      .filter((pos: any) => pos.share !== '0')
      .map(async (pos: any) => {
        pos.amount = await bentobox.toAmount(pos.token.id, parseUnits(pos.share, pos.token.decimals), false);
        return pos;
      })
  );
};

const queryBentoboxPositionWeb3 = async (
  chainId: number,
  account: string,
  address: string,
  web3provider: Web3Provider
): Promise<any> => {
  const bentobox = new Contract(BENTOBOX_ADDR[chainId], BENTO_ABI, web3provider);
  try {
    const token = new Contract(address, ERC20_ABI, web3provider);
    const share = await bentobox.balanceOf(address, account);
    return {
      symbol: await token.symbol(),
      decimals: await token.decimals(),
      balance: await bentobox.toAmount(address, share, false),
      share: share,
    };
  } catch (e) {
    return null;
  }
};

export { BENTOBOX_ENDPOINT, BENTOBOX_ADDR, queryBentoboxPositions, queryBentoboxPositionWeb3 };
