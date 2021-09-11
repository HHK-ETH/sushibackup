import React, {useEffect, useState} from "react";
import {useWeb3React} from "@web3-react/core";
import {Web3Provider} from "@ethersproject/providers";
import {GoHome} from "./GoHome";
import {TxPendingModal} from "./TxPendingModal";
import {BigNumber, Contract, ethers, providers} from "ethers";
import {AUCTION_LIST, ERC20, MISO_TYPES_LIST} from "../constant";
import { formatUnits, parseUnits } from "@ethersproject/units";
import { format } from "path";

export function Miso(): JSX.Element {
    const context = useWeb3React<Web3Provider>();
    const {connector, library, chainId, account, activate, deactivate, active, error} = context;
    const [txPending, setTxPending] = useState('');
    let tokenAmount: number = 0;
    const [auctionOpen, setAuctionOpen] = useState(true);
    const [auction, setAuction] = useState(AUCTION_LIST[0]);

    useEffect(() => {
        async function fetchAuctionOpen() {
            if (!connector) return;
            const web3Provider = new providers.Web3Provider(await connector.getProvider());
            // @ts-ignore
            const miso: Contract = new Contract(auction.address, MISO_TYPES_LIST[auction.type], web3Provider);
            const finalized: boolean = await miso.finalized();
            setAuctionOpen(!finalized);
        };
        fetchAuctionOpen();
    }, [auction, connector]);

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
            <h1 className={"text-3xl mb-12"}>Commit or Withdraw tokens from MISO</h1>
            <label className="text-small font-bold mb-2 block">
                MISO auction
            </label>
            <select
                className="shadow w-6/12 border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-8"
                onChange={e => {
                    const newAuction = AUCTION_LIST.find((auction) => {
                        return auction.address === e.target.value;
                    });
                    if (newAuction) setAuction(newAuction);
                }} placeholder="MISO auction">
                {AUCTION_LIST.map((auction) => {
                    return <option key={auction.address} value={auction.address}>{auction.name}</option>
                })}
            </select>
            {auctionOpen && <><label className="text-small font-bold mb-2 block">
                Amount to commit
            </label>
            <input
                className="shadow w-6/12 border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-8"
                type="text" onChange={e => {
                tokenAmount = parseFloat(e.target.value);
            }} placeholder="Amount to commit"/></>}
            <div>
                {!auctionOpen && <><button
                    className="bg-black text-white px-12 focus:outline-none rounded font-medium text-lg m-4"
                    onClick={() => {
                        async function withdraw() {
                            if (active && connector && account && chainId) {
                                const web3Provider = new providers.Web3Provider(await connector.getProvider());
                                // @ts-ignore
                                const miso: Contract = new Contract(auction.address, MISO_TYPES_LIST[auction.type], web3Provider);
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
                >Claim
                </button></>}
                {auctionOpen && <><button
                    className="bg-black text-white px-12 focus:outline-none rounded font-medium text-lg m-4"
                    onClick={() => {
                        async function approve() {
                            if (active && connector && account && chainId) {
                                if (tokenAmount === 0 || isNaN(tokenAmount)) {
                                    alert("Please select an amount of token superior to 0!");
                                    return;
                                }
                                const web3Provider = new providers.Web3Provider(await connector.getProvider());
                                // @ts-ignore
                                const miso: Contract = new Contract(auction.address, MISO_TYPES_LIST[auction.type], web3Provider);
                                const misoWithSigner: Contract = miso.connect(web3Provider.getSigner());
                                const tokenAddr = await misoWithSigner.paymentCurrency();
                                const tokenContract = new Contract(tokenAddr, ERC20, web3Provider);
                                const tokenContractWithSigner = await tokenContract.connect(web3Provider.getSigner());
                                const allowance = parseFloat(formatUnits(
                                    await tokenContractWithSigner.allowance(account, misoWithSigner.address), 
                                    await tokenContractWithSigner.decimals()
                                ));
                                if (allowance > tokenAmount) {
                                    alert('You already approved the contract, please commit!');
                                    return;
                                }
                                const tx = await tokenContractWithSigner.approve(misoWithSigner.address, parseUnits(tokenAmount.toString(), await tokenContractWithSigner.decimals()));
                                setTxPending(tx.hash);
                                await web3Provider.waitForTransaction(tx.hash, 1);
                                setTxPending('');
                                alert('Transaction successfully mined !');
                            } else {
                                alert("Please connect wallet and enter an address");
                            }
                        }
                        approve();
                    }}
                >Approve
                </button>
                <button
                    className="bg-black text-white px-12 focus:outline-none rounded font-medium text-lg m-4"
                    onClick={() => {
                        async function commit() {
                            if (active && connector && account && chainId) {
                                if (tokenAmount === 0 || isNaN(tokenAmount)) {
                                    alert("Please select an amount of token superior to 0!");
                                    return;
                                }
                                const web3Provider = new providers.Web3Provider(await connector.getProvider());
                                // @ts-ignore
                                const miso: Contract = new Contract(auction.address, MISO_TYPES_LIST[auction.type], web3Provider);
                                const misoWithSigner: Contract = miso.connect(web3Provider.getSigner());
                                const tokenAddr = await misoWithSigner.paymentCurrency();
                                const tokenContract = new Contract(tokenAddr, ERC20, web3Provider);
                                const tokenContractWithSigner = await tokenContract.connect(web3Provider.getSigner());
                                const allowance = parseFloat(formatUnits(
                                    await tokenContractWithSigner.allowance(account, misoWithSigner.address), 
                                    await tokenContractWithSigner.decimals()
                                ));
                                if (allowance < tokenAmount) {
                                    alert('Please approve the contract first!');
                                    return;
                                }
                                const tx = await misoWithSigner.commitTokens(parseUnits(tokenAmount.toString(), await tokenContractWithSigner.decimals()), true);
                                setTxPending(tx.hash);
                                await web3Provider.waitForTransaction(tx.hash, 1);
                                setTxPending('');
                                alert('Transaction successfully mined !');
                            } else {
                                alert("Please connect wallet and enter an address");
                            }
                        }
                        commit();
                    }}
                >Commit
                </button></>}
            </div>
            <GoHome/>
        </div>
    );
}