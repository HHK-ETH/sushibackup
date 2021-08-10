import React, {useState} from "react";
import {useWeb3React} from "@web3-react/core";
import {Web3Provider} from "@ethersproject/providers";
import {ContractHelper} from "../contractHelper";
import {providers} from "ethers";
import {TxPendingModal} from "./TxPendingModal";
import {TOKENS} from "../constant";

export function BentoForm({contractHelper}: {contractHelper: ContractHelper | undefined}): JSX.Element {
    const context = useWeb3React<Web3Provider>();
    const {connector, library, chainId, account, activate, deactivate, active, error} = context;
    const [txPending, setTxPending] = useState('');
    let tokenAmount: number = 0;
    let tokenSelected: any = TOKENS[0];

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
            <select
                className="shadow w-6/12 border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-8"
                onChange={e => {
                    tokenSelected = TOKENS.find((token) => {
                        return token.address === e.target.value;
                    });
                }} placeholder="Token address">
                {TOKENS.map((token, index) => {
                    return (
                        <option key={index} value={token.address}>{token.name + ' (' + token.symbol + ')'}</option>
                    )
                })}
            </select>
            <label className="text-small font-bold mb-2 block">
                Amount
            </label>
            <input
                className="shadow w-6/12 border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-8"
                type="text" onChange={e => {
                tokenAmount = parseFloat(e.target.value)
            }} placeholder="Amount"/>
            <div>
                <button
                    className="bg-black text-white px-12 focus:outline-none rounded font-medium text-lg m-4"
                    onClick={() => {
                        async function deposit() {
                            if (contractHelper && connector) {
                                const tx = await contractHelper.bentoBox.deposit(
                                    tokenSelected.address,
                                    account,
                                    account,
                                    (Math.pow(10, tokenSelected.decimals) * tokenAmount).toString(),
                                    0);
                                setTxPending(tx.hash);
                                const web3Provider = new providers.Web3Provider(await connector.getProvider());
                                await web3Provider.waitForTransaction(tx.hash, 1);
                                setTxPending('');
                                alert('Transaction successfully mined !');
                            }
                        }

                        deposit();
                    }}
                >Deposit
                </button>
                <button
                    className="bg-black text-white px-12 focus:outline-none rounded font-medium text-lg m-4"
                    onClick={() => {
                        async function withdraw() {
                            if (contractHelper && connector) {
                                console.log('ok')
                                const tx = await contractHelper.bentoBox.withdraw(
                                    tokenSelected.address,
                                    account,
                                    account,
                                    (Math.pow(10, tokenSelected.decimals) * tokenAmount).toString(),
                                    0
                                );
                                setTxPending(tx.hash);
                                const web3Provider = new providers.Web3Provider(await connector.getProvider());
                                await web3Provider.waitForTransaction(tx.hash, 1);
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