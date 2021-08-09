import * as React from "react";
import { useWeb3React, UnsupportedChainIdError } from '@web3-react/core'
import {
    NoEthereumProviderError,
    UserRejectedRequestError as UserRejectedRequestErrorInjected
} from '@web3-react/injected-connector'
import { UserRejectedRequestError as UserRejectedRequestErrorWalletConnect } from '@web3-react/walletconnect-connector'
import { UserRejectedRequestError as UserRejectedRequestErrorFrame } from '@web3-react/frame-connector'
import { Web3Provider } from '@ethersproject/providers'

import { useEagerConnect, useInactiveListener } from './hooks'
import {
    injected,
    network,
    walletconnect,
    walletlink,
    ledger,
    trezor,
    lattice,
    frame,
    authereum,
    fortmatic,
    magic,
    portis,
    torus
} from './connectors'

enum ConnectorNames {
    Injected = 'Injected',
    Network = 'Network',
    WalletConnect = 'WalletConnect',
    WalletLink = 'WalletLink',
    Ledger = 'Ledger',
    Trezor = 'Trezor',
    Lattice = 'Lattice',
    Frame = 'Frame',
    Authereum = 'Authereum',
    Fortmatic = 'Fortmatic',
    Magic = 'Magic',
    Portis = 'Portis',
    Torus = 'Torus'
}

const connectorsByName: { [connectorName in ConnectorNames]: any } = {
    [ConnectorNames.Injected]: injected,
    [ConnectorNames.Network]: network,
    [ConnectorNames.WalletConnect]: walletconnect,
    [ConnectorNames.WalletLink]: walletlink,
    [ConnectorNames.Ledger]: ledger,
    [ConnectorNames.Trezor]: trezor,
    [ConnectorNames.Lattice]: lattice,
    [ConnectorNames.Frame]: frame,
    [ConnectorNames.Authereum]: authereum,
    [ConnectorNames.Fortmatic]: fortmatic,
    [ConnectorNames.Magic]: magic,
    [ConnectorNames.Portis]: portis,
    [ConnectorNames.Torus]: torus
}

function getErrorMessage(error: Error) {
    if (error instanceof NoEthereumProviderError) {
        return 'No Ethereum browser extension detected, install MetaMask on desktop or visit from a dApp browser on mobile.'
    } else if (error instanceof UnsupportedChainIdError) {
        return "You're connected to an unsupported network."
    } else if (
        error instanceof UserRejectedRequestErrorInjected ||
        error instanceof UserRejectedRequestErrorWalletConnect ||
        error instanceof UserRejectedRequestErrorFrame
    ) {
        return 'Please authorize this website to access your Ethereum account.'
    } else {
        console.error(error)
        return 'An unknown error occurred. Check the console for more details.'
    }
}

export function Wallet() {
    const context = useWeb3React<Web3Provider>()
    const { connector, library, chainId, account, activate, deactivate, active, error } = context

    // handle logic to recognize the connector currently being activated
    const [activatingConnector, setActivatingConnector] = React.useState<any>()
    React.useEffect(() => {
        if (activatingConnector && activatingConnector === connector) {
            setActivatingConnector(undefined)
        }
    }, [activatingConnector, connector])

    // handle logic to eagerly connect to the injected ethereum provider, if it exists and has granted access already
    const triedEager = useEagerConnect()

    // handle logic to connect in reaction to certain events on the injected ethereum provider, if it exists
    useInactiveListener(!triedEager || !!activatingConnector)

    return (
        <div className={""}>
            <div className={"grid justify-items-center grid-cols-2 gap-3"}>
                {Object.keys(connectorsByName).map(name => {
                    // @ts-ignore
                    const currentConnector = connectorsByName[name]
                    const activating = currentConnector === activatingConnector
                    const connected = currentConnector === connector
                    const disabled = !triedEager || !!activatingConnector || connected || !!error
                    const bgColor = connected ? 'bg-light_blue' : 'bg-black'

                    return (
                        <button
                            className={bgColor +" text-white px-9 focus:outline-none border-rounded font-medium text-medium w-full"}
                            disabled={disabled}
                            key={name}
                            onClick={() => {
                                setActivatingConnector(currentConnector)
                                // @ts-ignore
                                activate(connectorsByName[name])
                            }}
                        >{name}
                        </button>
                    )
                })}
            </div>
            <div className={"grid justify-items-center mt-3"}>
                {(active || error) && (
                    <button
                        className="bg-black text-white px-9 focus:outline-none border-rounded font-medium text-medium"
                        onClick={() => {
                            deactivate()
                        }}
                    >
                        Deactivate
                    </button>
                )}

                {!!error && <h4>{getErrorMessage(error)}</h4>}
            </div>
        </div>
    )
}