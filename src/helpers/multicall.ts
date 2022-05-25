import { Web3Provider } from '@ethersproject/providers';
import { BigNumber, Contract } from 'ethers';
import { MULTICALL_ABI } from '../imports/abis';

const ADDRESS = '0xcA11bde05977b3631167028862bE2a173976CA11';

type Call = {
  target: string;
  callData: string;
};

const multicall = async (
  calls: Call[],
  provider: Web3Provider
): Promise<{ blockNumber: BigNumber; returnData: string[] }> => {
  const multicall = new Contract(ADDRESS, MULTICALL_ABI, provider);
  return await multicall.aggregate(calls);
};

export { multicall };
