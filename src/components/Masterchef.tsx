import React, {useState} from "react";
import {useWeb3React} from "@web3-react/core";
import {Web3Provider} from "@ethersproject/providers";
import {TxPendingModal} from "./TxPendingModal";
import {GoHome} from "./GoHome";
import { Contract, providers } from "ethers";
import { MASTERCHEF_ABI, MASTERCHEF_ADDR } from "../constant";

export function Masterchef(): JSX.Element {
    const context = useWeb3React<Web3Provider>();
    const {connector, library, chainId, account, activate, deactivate, active, error} = context;
    const [txPending, setTxPending] = useState('');
    const [poolInfos, setPoolInfos] = useState('');
    let contractAddress: string = '';

    if (!active || chainId !== 1) {
        return (
            <div className={"p-8 text-center"}>
                Plz connect your wallet and switch to Ethereum.
                <GoHome/>
            </div>
        );
    }

    return (
        <div className={"p-8 text-center"}>
            <TxPendingModal txPending={txPending}/>
            <h1 className={"text-3xl mb-12"}>Masterchef</h1>
            <label className="text-small font-bold mb-2 block">
                SLP contract address
            </label>
            <input
                className="shadow w-6/12 border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-8"
                type="text" onChange={e => {
                contractAddress = e.target.value
            }} placeholder="SLP contract address"/>
            <div>
                <button
                    className="bg-black text-white px-12 focus:outline-none rounded font-medium text-lg m-4"
                    onClick={() => {
                        async function verify() {
                            if (contractAddress.length > 0) {
                                const res = await fetch("https://api.thegraph.com/subgraphs/name/sushiswap/master-chef", 
                                {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'Accept': 'application/json',
                                    },
                                    body: JSON.stringify({query: `
                                        {
                                            pools (
                                              first: 1,
                                                where: {pair: "${contractAddress}"}
                                            ) {
                                              id
                                            }
                                        }
                                    `})
                                });
                                const resJson = await res.json();
                                console.log(resJson);
                                if (resJson.data === undefined || resJson.data.pools[0] === undefined) {
                                    alert("This contract has no pool in masterchef!");
                                    return;
                                }
                                setPoolInfos(resJson.data.pools[0].id);
                            } else {
                                alert("Please connect wallet and enter an address!");
                            }
                        }
                        verify();
                    }}
                >Fetch pool
                </button>
                <div>Pair _pid : {poolInfos}</div>
                {poolInfos.length > 0 &&
                    <>
                        <button
                        className="bg-black text-white px-12 focus:outline-none rounded font-medium text-lg m-4"
                        onClick={() => {
                            async function withdraw() {
                                if (active && connector && account && chainId) {
                                    const web3Provider = new providers.Web3Provider(await connector.getProvider());
                                    // @ts-ignore
                                    const masterchef: Contract = new Contract(MASTERCHEF_ADDR, MASTERCHEF_ABI, web3Provider);
                                    const userInfo = await masterchef.userInfo(poolInfos, account);
                                    const masterchefWithSigner: Contract = masterchef.connect(web3Provider.getSigner());
                                    const tx = await masterchefWithSigner.withdraw(poolInfos, userInfo.amount);
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
                    </>
                }
            </div>
            <GoHome/>
        </div>
    );
}