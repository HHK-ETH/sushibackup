import React, {useState} from "react";
import {useWeb3React} from "@web3-react/core";
import {Web3Provider} from "@ethersproject/providers";
import {Contract, providers} from "ethers";
import {TxPendingModal} from "./TxPendingModal";
import {BENTO_ADDR, TOKENS, BENTO_ABI} from "../constant";
import {GoHome} from "./GoHome";

export function BentoForm(): JSX.Element {
    const context = useWeb3React<Web3Provider>();
    const {connector, library, chainId, account, activate, deactivate, active, error} = context;
    const [txPending, setTxPending] = useState('');
    const TOKEN_LIST = chainId && (chainId === 1 || chainId === 137) ? TOKENS[chainId] : TOKENS[1];
    let tokenAmount: number = 0;
    let tokenSelected: any = TOKEN_LIST[0];

    if (!active || (chainId !== 1 && chainId !== 137)) {
        return (
            <div className={"p-8 text-center"}>
                Plz connect your wallet and switch to Ethereum or Polygon/Matic network
                <GoHome/>
            </div>
        );
    }

    return (
        <div className={"p-8 text-center"}>
            <TxPendingModal txPending={txPending}/>
            <h1 className={"text-3xl mb-12"}>Remove and deposit into BentoBox</h1>
            <label className="text-small font-bold mb-2 block">
                Token
            </label>
            <small className={"block"}>(TIP: when opening the list, on your keyboard tap the first letter of the asset to find it)</small>
            <select
                className="shadow w-6/12 border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-8"
                onChange={e => {
                    tokenSelected = TOKEN_LIST.find((token) => {
                        return token.address === e.target.value;
                    });
                }} placeholder="Token address">
                {TOKEN_LIST.map((token, index) => {
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
                            if (connector && chainId) {
                                const web3Provider = new providers.Web3Provider(await connector.getProvider());
                                //@ts-ignore
                                const bentoBox = new Contract(BENTO_ADDR[chainId], BENTO_ABI, web3Provider);
                                const bentoBoxWithSigner = bentoBox.connect(web3Provider.getSigner());
                                const tx = await bentoBoxWithSigner.deposit(
                                    tokenSelected.address,
                                    account,
                                    account,
                                    (Math.pow(10, tokenSelected.decimals) * tokenAmount).toString(),
                                    0);
                                setTxPending(tx.hash);
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
                            if (connector && chainId) {
                                const web3Provider = new providers.Web3Provider(await connector.getProvider());
                                //@ts-ignore
                                const bentoBox = new Contract(BENTO_ADDR[chainId], BENTO_ABI, web3Provider);
                                const bentoBoxWithSigner = bentoBox.connect(web3Provider.getSigner());
                                const tx = await bentoBoxWithSigner.withdraw(
                                    tokenSelected.address,
                                    account,
                                    account,
                                    (Math.pow(10, tokenSelected.decimals) * tokenAmount).toString(),
                                    0
                                );
                                setTxPending(tx.hash);
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
            <GoHome/>
        </div>
    );
}