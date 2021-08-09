import React from 'react';
import {Header} from "./Header";
import {Web3Provider} from "@ethersproject/providers";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import { Web3ReactProvider } from '@web3-react/core';

function getLibrary(provider: any) {
    const library = new Web3Provider(provider)
    library.pollingInterval = 12000
    return library
}

function App(): JSX.Element {
    return (
        <Router>
            <Web3ReactProvider getLibrary={getLibrary}>
                <div className="App grid grid-cols-3">
                    <Header/>
                    <div className={""}>
                        test
                    </div>
                </div>
            </Web3ReactProvider>
        </Router>
    );
}

export default App;
