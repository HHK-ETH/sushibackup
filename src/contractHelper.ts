import {Contract} from "ethers";
import {BENTO_ADDR} from "./constant";
import BENTO_ABI from './abis/bento.json'

export class ContractHelper {

    public bentoBox: Contract;

    private static instance?: ContractHelper;

    public static getInstance(): ContractHelper | undefined {
        return ContractHelper.instance;
    }

    public static init(web3Provider: any, chainId: number): ContractHelper {
        if (chainId !== 1 && chainId !== 137) chainId = 1;
        // @ts-ignore
        const bentoBox = new Contract(BENTO_ADDR[chainId], BENTO_ABI, web3Provider);
        const bentoBoxWithSigner = bentoBox.connect(web3Provider.getSigner());

        this.instance = new ContractHelper(bentoBoxWithSigner);
        return this.instance;
    }

    private constructor(bentoBox: Contract) {
        this.bentoBox = bentoBox
    }

}