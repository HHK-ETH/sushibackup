import React, {useState} from "react";
import {useWeb3React} from "@web3-react/core";
import {Web3Provider} from "@ethersproject/providers";
import {ContractHelper} from "../contractHelper";
import {BigNumber, providers} from "ethers";
import {TxPendingModal} from "./TxPendingModal";

export function BentoForm(): JSX.Element {
    const context = useWeb3React<Web3Provider>();
    const {connector, library, chainId, account, activate, deactivate, active, error} = context;
    const [txPending, setTxPending] = useState('');
    let tokenAddr: string = "";
    let tokenAmount: string = "";
    const contractHelper = ContractHelper.getInstance();

    if (!active) {
        return (<div className={"p-8 text-center"}>
            Plz connect your wallet and switch to Polygon/Matic network
        </div>);
    }

    return (
        <div className={"p-8 text-center"}>
            <TxPendingModal txPending={txPending}/>
            <label className="text-small font-bold mb-2 block">
                Token address
            </label>
            <input
                className="shadow w-6/12 border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-8"
                type="text" onChange={e => {
                tokenAddr = e.target.value
            }} placeholder="Token address"/>
            <label className="text-small font-bold mb-2 block">
                Amount
            </label>
            <input
                className="shadow w-6/12 border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-8"
                type="text" onChange={e => {
                tokenAmount = e.target.value
            }} placeholder="Amount (plz add decimal)"/>
            <div>
                <button
                    className="bg-black text-white px-12 focus:outline-none rounded font-medium text-lg m-4"
                    onClick={() => {
                        alert('Only withdraw is available right now')
                    }}
                >Deposit
                </button>
                <button
                    className="bg-black text-white px-12 focus:outline-none rounded font-medium text-lg m-4"
                    onClick={() => {
                        async function withdraw() {
                            if (contractHelper && connector) {
                                const tx = await contractHelper.bentoBox.withdraw(tokenAddr, account, account, BigNumber.from(tokenAmount), 0);
                                setTxPending(tx.hash);
                                const web3Provider = new providers.Web3Provider(await connector.getProvider());
                                await web3Provider.waitForTransaction(tx.hash, 5);
                                setTxPending('');
                                alert('Transaction successfully mined !');
                            }
                        }
                        withdraw();
                    }}
                >Withdraw
                </button>
            </div>
        </div>
    );
}