import { Web3Provider } from '@ethersproject/providers';
import { BigNumber, Contract } from 'ethers';
import { request, gql } from 'graphql-request';
import { CHAIN_IDS } from './network';
import msv1Abi from './../imports/abis/masterchef.json';
import msv2Abi from './../imports/abis/masterchefv2.json';
import minichefAbi from './../imports/abis/minichef.json';
import rewarderAbi from './../imports/abis/rewarder.json';
import erc20Abi from './../imports/abis/erc20.json';
import { EXCHANGE_ENDPOINTS } from './exchange';

export interface IFarmPosition {
  pair: string;
  name: string;
  pid: string;
  amount: string;
  pendingSushi: BigNumber;
  pendingToken: BigNumber | undefined;
  rewardToken: string | undefined;
  contract: Contract;
}

const MSV1_QUERY = gql`
  query queryFarms($address: Bytes!) {
    users(where: { address: $address }) {
      amount
      pool {
        id
        pair
        allocPoint
      }
    }
  }
`;

const MSV2_QUERY = gql`
  query queryFarms($address: Bytes!) {
    users(where: { address: $address }) {
      amount
      pool {
        id
        pair
        allocPoint
        rewarder {
          id
          rewardToken
        }
      }
    }
  }
`;

const LP_QUERY = gql`
  query queryLpName($address: ID!) {
    pair(id: $address) {
      name
    }
  }
`;

const MINICHEF_ENDPOINT: { [chainId: number]: string } = {
  [CHAIN_IDS.ARBITRUM]: 'https://api.thegraph.com/subgraphs/name/sushiswap/arbitrum-minichef',
  [CHAIN_IDS.CELO]: 'https://api.thegraph.com/subgraphs/name/sushiswap/celo-minichef-v2',
  [CHAIN_IDS.HARMONY]: 'https://sushi.graph.t.hmny.io/subgraphs/name/sushiswap/harmony-minichef',
  [CHAIN_IDS.MOONRIVER]: 'https://api.thegraph.com/subgraphs/name/sushiswap/moonriver-minichef',
  [CHAIN_IDS.POLYGON]: 'https://api.thegraph.com/subgraphs/name/sushiswap/matic-minichef',
  [CHAIN_IDS.XDAI]: 'https://api.thegraph.com/subgraphs/name/matthewlilley/xdai-minichef',
  [CHAIN_IDS.FANTOM]: 'https://api.thegraph.com/subgraphs/name/sushiswap/fantom-minichef',
};

const MINICHEF_ADDR: { [chainId: number]: string } = {
  [CHAIN_IDS.ARBITRUM]: '0xF4d73326C13a4Fc5FD7A064217e12780e9Bd62c3',
  [CHAIN_IDS.CELO]: '0x0769fd68dFb93167989C6f7254cd0D766Fb2841F',
  [CHAIN_IDS.HARMONY]: '0x67da5f2ffaddff067ab9d5f025f8810634d84287',
  [CHAIN_IDS.MOONRIVER]: '0x3dB01570D97631f69bbb0ba39796865456Cf89A5',
  [CHAIN_IDS.POLYGON]: '0x0769fd68dFb93167989C6f7254cd0D766Fb2841F',
  [CHAIN_IDS.XDAI]: '0xdDCbf776dF3dE60163066A5ddDF2277cB445E0F3',
  [CHAIN_IDS.FANTOM]: '0xf731202A3cf7EfA9368C2d7bD613926f7A144dB5',
};

const REWARD_TOKEN: { [chainId: number]: string } = {
  [CHAIN_IDS.CELO]: 'CELO',
  [CHAIN_IDS.HARMONY]: 'WONE',
  [CHAIN_IDS.MOONRIVER]: 'WMOVR',
  [CHAIN_IDS.POLYGON]: 'WMATIC',
  [CHAIN_IDS.XDAI]: 'STAKE',
  [CHAIN_IDS.FANTOM]: 'FTM',
};

const MASTERCHEF_ENDPOINT: string = 'https://api.thegraph.com/subgraphs/name/sushiswap/master-chef';
const MASTERCHEF_ADDR: string = '0xc2EdaD668740f1aA35E4D8f227fB8E17dcA888Cd';
const MASTERCHEFV2_ENDPOINT: string = 'https://api.thegraph.com/subgraphs/name/sushiswap/master-chefv2';
const MASTERCHEFV2_ADDR: string = '0xef0881ec094552b2e128cf945ef17a6752b4ec5d';

const queryFarmPositions = async (
  chainId: number,
  address: string,
  web3provider: Web3Provider
): Promise<IFarmPosition[]> => {
  const positions =
    chainId === 1
      ? await queryEthereumPositions(address, web3provider)
      : await querySidechainPositions(address, chainId, web3provider);
  return positions.map((pos) => {
    return {
      pair: pos.pool.pair,
      name: pos.pool.name,
      pid: pos.pool.id,
      amount: pos.amount,
      pendingSushi: pos.pendingSushi,
      pendingToken: pos.pendingToken,
      rewardToken: pos.rewardToken,
      contract: pos.contract,
    };
  });
};

const queryEthereumPositions = async (address: string, web3provider: Web3Provider): Promise<any[]> => {
  const masterchefv1 = new Contract(MASTERCHEF_ADDR, msv1Abi, web3provider);
  const masterchefv2 = new Contract(MASTERCHEFV2_ADDR, msv2Abi, web3provider);
  const msv1 = await request(MASTERCHEF_ENDPOINT, MSV1_QUERY, { address: address });
  const msv2 = await request(MASTERCHEFV2_ENDPOINT, MSV2_QUERY, { address: address });
  return await Promise.all([
    ...msv1.users
      .filter((pos: any) => {
        if (pos.pool) return true;
        return false;
      })
      .map(async (pos: any) => {
        const isLp = (await request(EXCHANGE_ENDPOINTS[1], LP_QUERY, { address: pos.pool.pair.toLowerCase() })).pair;
        pos.pool.name = isLp ? isLp.name : 'Unknow';
        pos.pendingSushi = await masterchefv1.pendingSushi(pos.pool.id, address);
        pos.contract = masterchefv1;
        return pos;
      }),
    ...msv2.users
      .filter((pos: any) => {
        if (pos.pool) return true;
        return false;
      })
      .map(async (pos: any) => {
        const isLp = (await request(EXCHANGE_ENDPOINTS[1], LP_QUERY, { address: pos.pool.pair.toLowerCase() })).pair;
        pos.pool.name = isLp ? isLp.name : 'Unknow';
        if (pos.pool.rewarder.id !== '0x0000000000000000000000000000000000000000') {
          const rewarder = new Contract(pos.pool.rewarder.id, rewarderAbi, web3provider);
          pos.pendingToken = await rewarder.pendingToken(pos.pool.id, address);
          const rewardToken = new Contract(await rewarder.rewardToken(), erc20Abi, web3provider);
          pos.rewardToken = await rewardToken.symbol();
        }
        pos.pendingSushi = await masterchefv2.pendingSushi(pos.pool.id, address);
        pos.contract = masterchefv2;
        return pos;
      }),
  ]);
};

const querySidechainPositions = async (
  address: string,
  chainId: number,
  web3provider: Web3Provider
): Promise<any[]> => {
  const minichef = new Contract(MINICHEF_ADDR[chainId], minichefAbi, web3provider);
  return await Promise.all([
    ...(
      await request(MINICHEF_ENDPOINT[chainId], MSV2_QUERY, { address: address })
    ).users
      .filter((pos: any) => {
        if (pos.pool) return true;
        return false;
      })
      .map(async (pos: any) => {
        const isLp = (await request(EXCHANGE_ENDPOINTS[chainId], LP_QUERY, { address: pos.pool.pair.toLowerCase() }))
          .pair;
        pos.pool.name = isLp ? isLp.name : 'Unknow';
        if (pos.pool.rewarder.id !== '0x0000000000000000000000000000000000000000') {
          const rewarder = new Contract(pos.pool.rewarder.id, rewarderAbi, web3provider);
          pos.pendingToken = await rewarder.pendingToken(pos.pool.id, address);
          if (chainId === CHAIN_IDS.ARBITRUM) {
            const rewardToken = new Contract(await rewarder.rewardToken(), erc20Abi, web3provider);
            pos.rewardToken = await rewardToken.symbol();
          } else {
            pos.rewardToken = REWARD_TOKEN[chainId];
          }
        }
        pos.pendingSushi = await minichef.pendingSushi(pos.pool.id, address);
        pos.contract = minichef;
        return pos;
      }),
  ]);
};

export { queryFarmPositions, MINICHEF_ADDR };
