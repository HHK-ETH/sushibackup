import React from 'react';
import {Header} from "./components/Header";
import {Web3Provider} from "@ethersproject/providers";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import {Web3ReactProvider} from '@web3-react/core';
import {BentoForm} from "./components/BentoForm";

function getLibrary(provider: any) {
    const library = new Web3Provider(provider)
    library.pollingInterval = 12000
    return library
}

function App(): JSX.Element {
    return (
        <Router>
            <Web3ReactProvider getLibrary={getLibrary}>
                <Header/>
                <div className="App">
                    <Route path={"/"}>
                        <BentoForm/>
                    </Route>
                </div>
            </Web3ReactProvider>
        </Router>
    );
}

export default App;
