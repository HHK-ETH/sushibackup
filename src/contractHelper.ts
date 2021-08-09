import {Contract} from "ethers";
import {BENTO_ABI, BENTO_ADDR} from "./constant";

export class ContractHelper {

    public bentoBox: Contract;

    private static instance?: ContractHelper;

    public static getInstance(): ContractHelper | undefined {
        return ContractHelper.instance;
    }

    public static init(web3Provider: any): ContractHelper {
        const bentoBox = new Contract(BENTO_ADDR, BENTO_ABI, web3Provider);
        const bentoBoxWithSigner = bentoBox.connect(web3Provider.getSigner());

        this.instance = new ContractHelper(bentoBoxWithSigner);
        return this.instance;
    }

    private constructor(bentoBox: Contract) {
        this.bentoBox = bentoBox
    }

}