import React, {useState} from "react";
import {ConnectModal} from "../wallet/ConnectModal";
import {Web3Provider} from "@ethersproject/providers";
import {useWeb3React} from "@web3-react/core";
import { NETWORKS } from "../../helpers/network";

export function Header(): JSX.Element {
    const context = useWeb3React<Web3Provider>();
    const {account, active, chainId} = context;
    const connectBtnLabel = active && account ? account.slice(0, 5) + '***' + account?.slice(account.length - 5, account.length) : 'Connect wallet';
    const [open, setOpen] = useState(false);

    return (
        <>
            <ConnectModal open={open} setOpen={setOpen} />
            <nav className="p-6">
                    <button
                        className="bg-pink-500 hover:bg-pink-600 text-white px-12 focus:outline-none rounded font-medium text-lg float-right"
                        onClick={() => setOpen(true)}
                    >
                        {chainId &&
                            <img className={"h-6 inline-block mr-4 -ml-4 -mt-1 py-1"} alt={"chain-logo"} src={NETWORKS.find((network) => {return network.id === chainId})?.logo}/>
                        }
                        {connectBtnLabel}
                    </button>
            </nav>
        </>
    );
}