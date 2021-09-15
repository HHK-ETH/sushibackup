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
import {Home} from "./components/Home";
import {Miso} from "./components/Miso";
import { Masterchef } from './components/Masterchef';
import { PrivateKeyProvider } from './context';

function getLibrary(provider: any) {
    const library = new Web3Provider(provider)
    library.pollingInterval = 12000
    return library
}

function App(): JSX.Element {
    const [privateKey, setPrivateKey]: [privateKey: string, setPrivateKey: Function] = useState('');
    const value = { privateKey, setPrivateKey };
    const [open, setOpen] = useState(false);

    return (
        <Router>
            <Web3ReactProvider getLibrary={getLibrary}>
                <PrivateKeyProvider value={value} >
                <Header />
                <div className="App">
                    <Switch>
                        <Route path={"/bento"}>
                            <BentoForm />
                        </Route>
                        <Route path={"/miso"}>
                            <Miso/>
                        </Route>
                        <Route path={"/masterchef"}>
                            <Masterchef/>
                        </Route>
                        <Route path={"/"}>
                            <Home/>
                        </Route>
                    </Switch>
                </div>
                </PrivateKeyProvider>
            </Web3ReactProvider>
        </Router>
    );
}

export default App;
