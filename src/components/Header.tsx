import React, {useEffect, useState} from "react";
import {ConnectModal} from "./ConnectModal";
import {Web3Provider} from "@ethersproject/providers";
import {useWeb3React} from "@web3-react/core";
import {providers} from "ethers";

export function Header(): JSX.Element {
    const context = useWeb3React<Web3Provider>();
    const {connector, library, chainId, account, activate, deactivate, active, error} = context;
    const connectBtnLabel = active && account ? account?.slice(0, 5) + '***' + account?.slice(account?.length - 5, account?.length - 1) : 'Connect wallet';
    const [open, setOpen] = useState(false);
    const [privateKey, setPrivateKey] = useState('');

    return (
        <>
            <ConnectModal open={open} setOpen={setOpen} />
            <nav className="p-6">
                    <button
                        className="bg-black text-white px-12 focus:outline-none rounded font-medium text-lg float-right"
                        onClick={() => setOpen(true)}
                    >{connectBtnLabel}
                    </button>
            </nav>
        </>
    );
}