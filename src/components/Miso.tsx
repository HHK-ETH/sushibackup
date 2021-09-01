import React, {useState} from "react";
import {useWeb3React} from "@web3-react/core";
import {Web3Provider} from "@ethersproject/providers";
import {GoHome} from "./GoHome";
import {TxPendingModal} from "./TxPendingModal";
import {BigNumber, Contract, ethers, providers} from "ethers";
import {ERC20, MISO_TYPES_LIST} from "../constant";
import { formatUnits, parseUnits } from "@ethersproject/units";
import { format } from "path";

export function Miso(): JSX.Element {
    const context = useWeb3React<Web3Provider>();
    const {connector, library, chainId, account, activate, deactivate, active, error} = context;
    const [txPending, setTxPending] = useState('');
    let misoType: string | undefined = 'BatchAuction';
    let misoAddress: string = '';
    let tokenAmount: number = 0;

    if (!active || chainId !== 1) {
        return (
            <div className={"p-8 text-center"}>
                Plz connect your wallet and switch to Ethereum network
                <GoHome/>
            </div>
        );
    }

    return (
        <div className={"p-8 text-center"}>
            <TxPendingModal txPending={txPending}/>
            <h1 className={"text-3xl mb-12"}>Commit or Withdraw tokens from MISO</h1>
            <label className="text-small font-bold mb-2 block">
                MISO auction type
            </label>
            <select
                className="shadow w-6/12 border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-8"
                onChange={e => {
                    misoType = Object.keys(MISO_TYPES_LIST).find((type) => {
                        return type === e.target.value;
                    });
                }} placeholder="MISO auction type">
                {Object.keys(MISO_TYPES_LIST).map((type, index) => {
                    return (
                        <option key={index} value={type}>{type}</option>
                    );
                })}
            </select>
            <label className="text-small font-bold mb-2 block">
                Contract address
            </label>
            <input
                className="shadow w-6/12 border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-8"
                type="text" onChange={e => {
                misoAddress = e.target.value
            }} placeholder="Contract address"/>
            <label className="text-small font-bold mb-2 block">
                Amount of token to commit
            </label>
            <input
                className="shadow w-6/12 border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-8"
                type="text" onChange={e => {
                tokenAmount = parseFloat(e.target.value);
            }} placeholder="Amount of token to commit (let empty if withdrawing)"/>
            <div>
                <button
                    className="bg-black text-white px-12 focus:outline-none rounded font-medium text-lg mr-8"
                    onClick={() => {
                        async function withdraw() {
                            if (active && connector && account && chainId && misoAddress.length > 0 && misoType) {
                                const web3Provider = new providers.Web3Provider(await connector.getProvider());
                                // @ts-ignore
                                const miso: Contract = new Contract(misoAddress, MISO_TYPES_LIST[misoType], web3Provider);
                                const misoWithSigner: Contract = miso.connect(web3Provider.getSigner());
                                const tx = await misoWithSigner.withdrawTokens();
                                setTxPending(tx.hash);
                                await web3Provider.waitForTransaction(tx.hash, 1);
                                setTxPending('');
                                alert('Transaction successfully mined !');
                            } else {
                                alert("Please connect wallet and enter an address");
                            }
                        }

                        withdraw();
                    }}
                >Withdraw
                </button>
                <button
                    className="bg-black text-white px-12 focus:outline-none rounded font-medium text-lg mr-8"
                    onClick={() => {
                        async function approve() {
                            if (active && connector && account && chainId && misoAddress.length > 0 && misoType) {
                                const web3Provider = new providers.Web3Provider(await connector.getProvider());
                                // @ts-ignore
                                const miso: Contract = new Contract(misoAddress, MISO_TYPES_LIST[misoType], web3Provider);
                                const misoWithSigner: Contract = miso.connect(web3Provider.getSigner());
                                const tokenAddr = await misoWithSigner.paymentCurrency();
                                const tokenContract = new Contract(tokenAddr, ERC20, web3Provider);
                                const tokenContractWithSigner = await tokenContract.connect(web3Provider.getSigner());
                                const allowance = parseFloat(formatUnits(
                                    await tokenContractWithSigner.allowance(account, misoWithSigner.address), 
                                    await tokenContractWithSigner.decimals()
                                ));
                                if (allowance > tokenAmount) {
                                    alert('You already approved the contract, please commit!');
                                    return;
                                }
                                const tx = await tokenContractWithSigner.approve(misoWithSigner.address, parseUnits(tokenAmount.toString(), await tokenContractWithSigner.decimals()));
                                setTxPending(tx.hash);
                                await web3Provider.waitForTransaction(tx.hash, 1);
                                setTxPending('');
                                alert('Transaction successfully mined !');
                            } else {
                                alert("Please connect wallet and enter an address");
                            }
                        }
                        approve();
                    }}
                >Approve
                </button>
                <button
                    className="bg-black text-white px-12 focus:outline-none rounded font-medium text-lg mr-8"
                    onClick={() => {
                        async function commit() {
                            if (active && connector && account && chainId && misoAddress.length > 0 && misoType) {
                                const web3Provider = new providers.Web3Provider(await connector.getProvider());
                                // @ts-ignore
                                const miso: Contract = new Contract(misoAddress, MISO_TYPES_LIST[misoType], web3Provider);
                                const misoWithSigner: Contract = miso.connect(web3Provider.getSigner());
                                const tokenAddr = await misoWithSigner.paymentCurrency();
                                const tokenContract = new Contract(tokenAddr, ERC20, web3Provider);
                                const tokenContractWithSigner = await tokenContract.connect(web3Provider.getSigner());
                                const allowance = parseFloat(formatUnits(
                                    await tokenContractWithSigner.allowance(account, misoWithSigner.address), 
                                    await tokenContractWithSigner.decimals()
                                ));
                                if (allowance < tokenAmount) {
                                    alert('Please approve the contract first!');
                                    return;
                                }
                                const tx = await misoWithSigner.commitTokens(parseUnits(tokenAmount.toString(), await tokenContractWithSigner.decimals()), true);
                                setTxPending(tx.hash);
                                await web3Provider.waitForTransaction(tx.hash, 1);
                                setTxPending('');
                                alert('Transaction successfully mined !');
                            } else {
                                alert("Please connect wallet and enter an address");
                            }
                        }
                        commit();
                    }}
                >Commit
                </button>
            </div>
            <GoHome/>
        </div>
    );
}