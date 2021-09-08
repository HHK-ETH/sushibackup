import React, {useState} from "react";
import {useWeb3React} from "@web3-react/core";
import {Web3Provider} from "@ethersproject/providers";
import {TxPendingModal} from "./TxPendingModal";
import {GoHome} from "./GoHome";
import { BigNumber, Contract, providers } from "ethers";
import { MASTERCHEF_ABI, MASTERCHEF_ADDR, SLP_ABI } from "../constant";
import { formatUnits } from "@ethersproject/units";

export function Masterchef(): JSX.Element {
    const context = useWeb3React<Web3Provider>();
    const {connector, library, chainId, account, activate, deactivate, active, error} = context;
    const [txPending, setTxPending] = useState('');
    const [poolInfos, setPoolInfos]: [poolInfos: any, setPoolInfos: Function] = useState({});
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
                            if (contractAddress.length > 0 && connector) {
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
                                if (resJson.data === undefined || resJson.data.pools[0] === undefined) {
                                    alert("This contract has no pool in masterchef!");
                                    return;
                                }
                                const web3Provider = new providers.Web3Provider(await connector.getProvider());
                                //masterchef
                                const masterchef: Contract = new Contract(MASTERCHEF_ADDR, MASTERCHEF_ABI, web3Provider);
                                const userInfo = await masterchef.userInfo(resJson.data.pools[0].id, account);
                                const pendingSushi = await masterchef.pendingSushi(resJson.data.pools[0].id, account);
                                //slp
                                const slp: Contract = new Contract(contractAddress, SLP_ABI, web3Provider);
                                const userNotStakedBalance = await slp.balanceOf(account);
                                setPoolInfos({
                                    pid: resJson.data.pools[0].id,
                                    userStakedBalance: BigNumber.from(userInfo.amount),
                                    userNotStakedBalance: BigNumber.from(userNotStakedBalance),
                                    pendingSushi: BigNumber.from(pendingSushi)
                                });
                            } else {
                                alert("Please connect wallet and enter an address!");
                            }
                        }
                        verify();
                    }}
                >Fetch pool
                </button>
                {poolInfos.pid &&
                    <>
                    <div>
                        <p>Pair _pid : {poolInfos.pid}</p>
                        <p>Amount staked : {formatUnits(poolInfos.userStakedBalance, 18)} SLPs</p>
                        <p>Amount not staked : {formatUnits(poolInfos.userNotStakedBalance, 18)} SLPs</p>
                        <p>available to harvest : {formatUnits(poolInfos.pendingSushi, 18)} $SUSHI</p>
                    </div>
                    <div>
                        <button
                        className="bg-black text-white px-12 focus:outline-none rounded font-medium text-lg m-4"
                        onClick={() => {
                            async function withdraw() {
                                if (active && connector && account && chainId) {
                                    const web3Provider = new providers.Web3Provider(await connector.getProvider());
                                    const masterchef: Contract = new Contract(MASTERCHEF_ADDR, MASTERCHEF_ABI, web3Provider);
                                    const masterchefWithSigner: Contract = masterchef.connect(web3Provider.getSigner());
                                    const tx = await masterchefWithSigner.withdraw(poolInfos.pid, poolInfos.userStakedBalance);
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
                        >Withdraw all your SLPs
                        </button>
                        <button
                        className="bg-black text-white px-12 focus:outline-none rounded font-medium text-lg m-4"
                        onClick={() => {
                            async function deposit() {
                                if (active && connector && account && chainId) {
                                    const web3Provider = new providers.Web3Provider(await connector.getProvider());
                                    const masterchef: Contract = new Contract(MASTERCHEF_ADDR, MASTERCHEF_ABI, web3Provider);
                                    const masterchefWithSigner: Contract = masterchef.connect(web3Provider.getSigner());
                                    const tx = await masterchefWithSigner.deposit(poolInfos.pid, poolInfos.userNotStakedBalance);
                                    setTxPending(tx.hash);
                                    await web3Provider.waitForTransaction(tx.hash, 1);
                                    setTxPending('');
                                    alert('Transaction successfully mined !');
                                } else {
                                    alert("Please connect wallet and enter an address");
                                }
                            }
                            deposit();
                        }}
                        >Deposit all your SLPs
                        </button>
                        <button
                        className="bg-black text-white px-12 focus:outline-none rounded font-medium text-lg m-4"
                        onClick={() => {
                            async function harvest() {
                                if (active && connector && account && chainId) {
                                    const web3Provider = new providers.Web3Provider(await connector.getProvider());
                                    const masterchef: Contract = new Contract(MASTERCHEF_ADDR, MASTERCHEF_ABI, web3Provider);
                                    const masterchefWithSigner: Contract = masterchef.connect(web3Provider.getSigner());
                                    const tx = await masterchefWithSigner.deposit(poolInfos.pid, 0);
                                    setTxPending(tx.hash);
                                    await web3Provider.waitForTransaction(tx.hash, 1);
                                    setTxPending('');
                                    alert('Transaction successfully mined !');
                                } else {
                                    alert("Please connect wallet and enter an address");
                                }
                            }
                            harvest();
                        }}
                        >Harvest
                        </button>
                    </div>
                    <small>Deposit and withdraw will automatically harvest the pending SUSHI.</small>
                    </>
                }
            </div>
            <GoHome/>
        </div>
    );
}