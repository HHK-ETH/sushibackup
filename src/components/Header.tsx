import React, {useState} from "react";
import {ConnectModal} from "./ConnectModal";

export function Header(): JSX.Element {
    const [open, setOpen] = useState(false);
    return (
        <div className={""}>
            <ConnectModal open={open} setOpen={setOpen}/>
            <button onClick={e => setOpen(true)}>
                Connect Wallet
            </button>
        </div>
    );
}