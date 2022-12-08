import { Web3Provider } from '@ethersproject/providers';
import { BigNumber, Contract } from 'ethers';
import { MULTICALL_ABI } from '../imports/abis';
import { CHAIN_IDS } from './network';

const ADDRESS = '0xcA11bde05977b3631167028862bE2a173976CA11';
const KAVA_ADDRESS = '0x30A62aA52Fa099C4B227869EB6aeaDEda054d121';

type Call = {
  target: string;
  callData: string;
};

const multicall = async (
  calls: Call[],
  provider: Web3Provider
): Promise<{ blockNumber: BigNumber; returnData: string[] }> => {
  let address = ADDRESS;
  if (provider._network.chainId === CHAIN_IDS.KAVA) {
    address = KAVA_ADDRESS;
  }
  const multicall = new Contract(address, MULTICALL_ABI, provider);
  return await multicall.aggregate(calls);
};

export { multicall };
