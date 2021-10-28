import React from 'react';
import {Header} from "./components/general/Header";
import {Web3Provider} from "@ethersproject/providers";
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";
import {Web3ReactProvider} from '@web3-react/core';
import {Home} from "./components/general/Home";
import { BACKGROUNDS } from './imports/images/backgrounds/backgrounds';

function getLibrary(provider: any) {
    const library = new Web3Provider(provider)
    library.pollingInterval = 12000
    return library
}

function getBackground(): string {
    const date = new Date().getTime();
    return BACKGROUNDS[date % 5];
}

function App(): JSX.Element {

    return (
        <div className="App bg-cover bg-no-repeat bg-center w-full h-screen" style={{backgroundImage: "url("+getBackground()+")"}}>
            <Router>
                <Web3ReactProvider getLibrary={getLibrary}>
                    <Header />
                        <Switch>
                            <Route path={"/"}>
                                <Home/>
                            </Route>
                        </Switch>
                </Web3ReactProvider>
            </Router>
        </div>
    );
}

export default App;
