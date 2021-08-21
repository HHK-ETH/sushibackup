import React, {useState} from "react";
import {useWeb3React} from "@web3-react/core";
import {Web3Provider} from "@ethersproject/providers";
import {GoHome} from "./GoHome";
import {TxPendingModal} from "./TxPendingModal";
import {Contract, ethers, providers} from "ethers";
import {MISO_TYPES_LIST} from "../constant";

export function Miso(): JSX.Element {
    const context = useWeb3React<Web3Provider>();
    const {connector, library, chainId, account, activate, deactivate, active, error} = context;
    const [txPending, setTxPending] = useState('');
    let misoType: string | undefined = 'BatchAuction';
    let misoAddress: string = '';

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
            <h1 className={"text-3xl mb-12"}>Withdraw tokens from MISO</h1>
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
            <div>
                <button
                    className="bg-black text-white px-12 focus:outline-none rounded font-medium text-lg"
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
                >Withdraw tokens
                </button>
            </div>
            <GoHome/>
        </div>
    );
}