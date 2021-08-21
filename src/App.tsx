import React, {useState} from 'react';
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
import {ContractHelper} from "./contractHelper";
import {Home} from "./components/Home";
import {Miso} from "./components/Miso";

function getLibrary(provider: any) {
    const library = new Web3Provider(provider)
    library.pollingInterval = 12000
    return library
}

function App(): JSX.Element {
    const [contractHelper, setContractHelper] = useState(ContractHelper.getInstance); //TODO use a context

    return (
        <Router>
            <Web3ReactProvider getLibrary={getLibrary}>
                <Header setContractHelper={setContractHelper}/>
                <div className="App">
                    <Switch>
                        <Route path={"/bento"}>
                            <BentoForm contractHelper={contractHelper}/>
                        </Route>
                        <Route path={"/miso"}>
                            <Miso/>
                        </Route>
                        <Route path={"/"}>
                            <Home/>
                        </Route>
                    </Switch>
                </div>
            </Web3ReactProvider>
        </Router>
    );
}

export default App;
