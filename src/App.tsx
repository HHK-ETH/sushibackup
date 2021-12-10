import Header from './components/general/Header';
import { Web3Provider } from '@ethersproject/providers';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Web3ReactProvider } from '@web3-react/core';
import Home from './components/general/Home';
import { BACKGROUNDS } from './imports/images/backgrounds/backgrounds';
import Kashi from './components/kashi/Kashi';
import SushiMaker from './components/sushiMaker/SushiMaker';
import Unwindoor from './components/unwindooor/Unwindooor';

function getLibrary(provider: any) {
  const library = new Web3Provider(provider);
  library.pollingInterval = 12000;
  return library;
}

function getBackground(): string {
  const date = new Date().getTime();
  return BACKGROUNDS[date % 5];
}

function App(): JSX.Element {
  return (
    <div
      className="w-full h-screen overflow-scroll bg-center bg-no-repeat bg-cover App"
      style={{ backgroundImage: 'url(' + getBackground() + ')' }}
    >
      <Router>
        <Web3ReactProvider getLibrary={getLibrary}>
          <Header />
          <Switch>
            <Route path={'/kashi'}>
              <Kashi />
            </Route>
            <Route path={'/sushimaker'}>
              <SushiMaker />
            </Route>
            <Route path={'/unwindooor'}>
              <Unwindoor />
            </Route>
            <Route path={'/'}>
              <Home />
            </Route>
          </Switch>
        </Web3ReactProvider>
      </Router>
    </div>
  );
}

export default App;
