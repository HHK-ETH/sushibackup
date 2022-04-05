import { CHAIN_IDS } from './network';

const DCA_FACTORY: { [chainId: number]: string } = {
  [CHAIN_IDS.POLYGON]: '0xE25cb7B7e8cA345807ec3E92A72E86CB85920922',
};

//Any token could be used but we display only most used ones to make it simpler.
const DCA_TOKENS: { [chainId: number]: { symbol: string; address: string; priceFeed: string }[] } = {
  [CHAIN_IDS.POLYGON]: [
    {
      symbol: 'DAI',
      address: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
      priceFeed: '0x4746DeC9e833A82EC7C2C1356372CcF2cfcD2F3D',
    },
    {
      symbol: 'WETH',
      address: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
      priceFeed: '0xF9680D99D6C9589e2a93a78A04A279e509205945',
    },
    {
      symbol: 'SUSHI',
      address: '0x0b3F868E0BE5597D5DB7fEB59E1CADBb0fdDa50a',
      priceFeed: '0x49B0c695039243BBfEb8EcD054EB70061fd54aa0',
    },
    {
      symbol: 'AAVE',
      address: '0xD6DF932A45C0f255f85145f286eA0b292B21C90B',
      priceFeed: '0x72484B12719E23115761D5DA1646945632979bB6',
    },
  ],
};

export { DCA_FACTORY, DCA_TOKENS };
