import * as React from "react";
import { useWeb3React, UnsupportedChainIdError } from '@web3-react/core'
import {
    NoEthereumProviderError,
    UserRejectedRequestError as UserRejectedRequestErrorInjected
} from '@web3-react/injected-connector'
import { UserRejectedRequestError as UserRejectedRequestErrorWalletConnect } from '@web3-react/walletconnect-connector'
import { UserRejectedRequestError as UserRejectedRequestErrorFrame } from '@web3-react/frame-connector'
import { Web3Provider } from '@ethersproject/providers'

import { useEagerConnect, useInactiveListener } from '../hooks'
import {
    injected,
    walletconnect
} from '../connectors'

enum ConnectorNames {
    Injected = 'Injected/Metamask',
    WalletConnect = 'WalletConnect'
}

const connectorsByName: { [connectorName in ConnectorNames]: any } = {
    [ConnectorNames.Injected]: injected,
    [ConnectorNames.WalletConnect]: walletconnect
}

function getErrorMessage(error: Error) {
    if (error instanceof NoEthereumProviderError) {
        return 'No Ethereum browser extension detected, install MetaMask on desktop or visit from a dApp browser on mobile.'
    } else if (error instanceof UnsupportedChainIdError) {
        return "You're connected to an unsupported network. Please change to polygon/matic"
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
    const { connector, activate, deactivate, active, error } = context

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
                    const connected = currentConnector === connector
                    const disabled = !triedEager || !!activatingConnector || connected || !!error
                    const bgColor = connected ? 'bg-green-500' : 'bg-black'

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