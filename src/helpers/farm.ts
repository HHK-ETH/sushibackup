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
import { ERC20_ABI, MASTERCHEF_ABI, MINICHEF_ABI, SLP_ABI } from '../imports/abis';
import { multicall } from './multicall';
import { AbiCoder } from 'ethers/lib/utils';

export interface IFarmPosition {
  pid: string;
  pair: string;
  amount: BigNumber;
  contract: Contract;
  pendingSushi: BigNumber;
  pendingToken: BigNumber;
  rewardToken: string;
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
  [CHAIN_IDS.BTTC]: 'https://subgraphs.sushi.com/subgraphs/name/sushiswap/minichef-bttc',
};

const MINICHEF_ADDR: { [chainId: number]: string } = {
  [CHAIN_IDS.ARBITRUM]: '0xF4d73326C13a4Fc5FD7A064217e12780e9Bd62c3',
  [CHAIN_IDS.CELO]: '0x0769fd68dFb93167989C6f7254cd0D766Fb2841F',
  [CHAIN_IDS.HARMONY]: '0x67da5f2ffaddff067ab9d5f025f8810634d84287',
  [CHAIN_IDS.MOONRIVER]: '0x3dB01570D97631f69bbb0ba39796865456Cf89A5',
  [CHAIN_IDS.POLYGON]: '0x0769fd68dFb93167989C6f7254cd0D766Fb2841F',
  [CHAIN_IDS.XDAI]: '0xdDCbf776dF3dE60163066A5ddDF2277cB445E0F3',
  [CHAIN_IDS.FANTOM]: '0xf731202A3cf7EfA9368C2d7bD613926f7A144dB5',
  [CHAIN_IDS.KAVA]: '0xf731202A3cf7EfA9368C2d7bD613926f7A144dB5',
  [CHAIN_IDS.BOBA]: '0x75f52766a6a23f736edefcd69dfbe6153a48c3f3',
  [CHAIN_IDS.BTTC]: '0xC09756432dAD2FF50B2D40618f7B04546DD20043',
};

const REWARD_TOKEN: { [chainId: number]: string } = {
  [CHAIN_IDS.CELO]: 'CELO',
  [CHAIN_IDS.HARMONY]: 'WONE',
  [CHAIN_IDS.MOONRIVER]: 'WMOVR',
  [CHAIN_IDS.POLYGON]: 'WMATIC',
  [CHAIN_IDS.XDAI]: 'STAKE',
  [CHAIN_IDS.FANTOM]: 'FTM',
  [CHAIN_IDS.BTTC]: 'BTT',
};

const MASTERCHEF_ENDPOINT: string = 'https://api.thegraph.com/subgraphs/name/sushiswap/master-chef';
const MASTERCHEF_ADDR: string = '0xc2EdaD668740f1aA35E4D8f227fB8E17dcA888Cd';
const MASTERCHEFV2_ENDPOINT: string = 'https://api.thegraph.com/subgraphs/name/sushiswap/master-chefv2';
const MASTERCHEFV2_ADDR: string = '0xef0881ec094552b2e128cf945ef17a6752b4ec5d';

const queryFarmsWeb3 = async (chainId: number, address: string, web3provider: Web3Provider) => {
  if (chainId === 1) {
    return [
      ...(await queryFarmWeb3(chainId, address, MASTERCHEF_ADDR, web3provider)),
      ...(await queryFarmWeb3(chainId, address, MASTERCHEFV2_ADDR, web3provider)),
    ];
  }
  return await queryFarmWeb3(chainId, address, MINICHEF_ADDR[chainId], web3provider);
};

const queryFarmWeb3 = async (chainId: number, address: string, farmAddress: string, web3provider: Web3Provider) => {
  const farm = new Contract(
    farmAddress,
    farmAddress.toLocaleLowerCase() === MASTERCHEF_ADDR.toLocaleLowerCase() ? MASTERCHEF_ABI : MINICHEF_ABI,
    web3provider
  );
  const length: BigNumber = await farm.poolLength();
  let queries = [];
  for (let index = 0; index < length.toNumber(); index++) {
    queries.push({
      target: farmAddress,
      callData: farm.interface.encodeFunctionData('userInfo', [index, address]),
    });
  }
  let pids: number[] = [];
  let results = await Promise.all(
    (
      await multicall(queries, web3provider)
    ).returnData
      .filter((encodedRes: string, pid: number) => {
        const data = new AbiCoder().decode(['uint256', 'uint256'], encodedRes);
        if (data[1].gt(0)) {
          pids.push(pid);
          return true;
        }
        return false;
      })
      .map(async (encodedRes: string, pid_index: number) => {
        const data = new AbiCoder().decode(['uint256', 'uint256'], encodedRes);
        const pid = pids[pid_index];
        let pendingSushi = BigNumber.from(0);
        let pendingToken = BigNumber.from(0);
        let rewardToken = '';
        let pair = 'UNKNOW';
        pendingSushi = await farm.pendingSushi(pid, address);
        if (farm.address.toLocaleLowerCase() !== MASTERCHEF_ADDR.toLocaleLowerCase()) {
          const rewarderAddr = await farm.rewarder(pid);
          if (rewarderAddr !== '0x0000000000000000000000000000000000000000') {
            const rewarder = new Contract(rewarderAddr, rewarderAbi, web3provider);
            pendingToken = await rewarder.pendingToken(pid, address);
            rewardToken = REWARD_TOKEN[chainId] ? REWARD_TOKEN[chainId] : 'Unknow token';
          }
          pair = await farm.lpToken(pid);
        } else {
          pair = (await farm.poolInfo(pid)).lpToken;
        }
        if (pair !== 'UNKNOW') {
          const lp = new Contract(pair, SLP_ABI, web3provider);
          pair = await lp.symbol();
          try {
            const token0 = new Contract(await lp.token0(), ERC20_ABI, web3provider);
            const token1 = new Contract(await lp.token1(), ERC20_ABI, web3provider);
            pair = (await token0.symbol()) + '-' + (await token1.symbol());
          } catch (e) {}
        }
        return {
          pid: pid,
          pair: pair,
          amount: data[0],
          contract: farm,
          pendingSushi: pendingSushi,
          pendingToken: pendingToken,
          rewardToken: rewardToken,
        };
      })
  );
  return results;
};

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

export { queryFarmPositions, queryFarmsWeb3, MINICHEF_ADDR, MASTERCHEF_ADDR };
