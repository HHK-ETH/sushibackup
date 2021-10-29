import { InjectedConnector } from '@web3-react/injected-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { WalletLinkConnector } from '@web3-react/walletlink-connector'
import { NETWORKS } from '../../helpers/network'

const RPC_URLS: { [chainId: number]: string } = {};
NETWORKS.map((network) => {
    RPC_URLS[network.id] = network.rpc
});

export const injected = new InjectedConnector({ supportedChainIds: NETWORKS.map((network) => {return network.id}) })

export const walletconnect = new WalletConnectConnector({
    rpc: RPC_URLS,
    qrcode: true
})

// todo: add multichain walletlink
export const walletlink = new WalletLinkConnector({
    url: RPC_URLS[1],
    appName: 'Sushi backup'
})