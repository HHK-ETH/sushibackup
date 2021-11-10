import { useWeb3React } from "@web3-react/core";
import {Web3Provider} from "@ethersproject/providers";
import { useEffect, useState } from "react";
import { fetchKashiPairsData } from "../../helpers/kashiHelper";
import { Contract, providers } from "ethers";
import { IKashiPairData, KASHI_PAIRS } from "../../imports/kashiPairs";

export function Kashi(): JSX.Element {
    const context = useWeb3React<Web3Provider>();
    const {account, active, chainId, connector} = context;
    const [kashiPairsData, setKashiPairsData]: [IKashiPairData[], Function] = useState([]);
    const [loading, setloading]: [boolean, Function] = useState(false);

    useEffect(() => {
        async function fetchKashi() {
            if (!chainId || !active || !connector || !KASHI_PAIRS[chainId] || !account) {
                setKashiPairsData([]);
                return;
            }
            setloading(true);
            const web3Provider = new providers.Web3Provider(await connector.getProvider(), "any");
            setKashiPairsData(await fetchKashiPairsData(web3Provider, account, chainId));
            setloading(false);
        }
        fetchKashi();
    }, [chainId, active, connector])

    if (!active) {
        return (
            <div className="text-xl text-center text-white">Please connect your wallet.</div>
        );
    }
    if (chainId && !KASHI_PAIRS[chainId]) {
        return (
            <div className={"mt-24 text-xl text-center text-white"}>Kashi is not available on this network.</div>
        );
    }

    return (
        <div className="container p-16 mx-auto text-center text-white">
            {loading && <div className={"text-white"}>loading data...</div>}
            <div className="grid grid-cols-6 py-8 bg-indigo-900 rounded-t-xl">
                <div className="">Asset</div>
                <div className="">Collateral</div>
                <div className="">Lend APR</div>
                <div className="">Borrow APR</div>
                <div className="">Utilization</div>
                <div className="">TVL</div>
            </div>
            {kashiPairsData.map((pair, i) => {
                return (
                    <div className="grid grid-cols-6 py-4 bg-indigo-900 cursor-pointer bg-opacity-60 hover:bg-opacity-75">
                        <div className="">
                            <img className="inline-block h-10 mr-2" alt="logo" src={pair.asset.logoURI}/>
                            {pair.asset.symbol}
                        </div>
                        <div className="">
                            <img className="inline-block h-10 mr-2" alt="logo" src={pair.collateral.logoURI}/>
                            {pair.collateral.symbol}
                        </div>
                        <div className="">Lend APR</div>
                        <div className="">Borrow APR</div>
                        <div className="">Utilization</div>
                        <div className="">TVL</div>
                    </div>
                )
            })}
        </div>
    )
}