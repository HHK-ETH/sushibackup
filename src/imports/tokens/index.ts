import { CHAIN_IDS } from '../../helpers/network';
import arbitrum from './arbitrum.json';
import avalanche from './avalanche.json';
import bsc from './bsc.json';
import celo from './celo.json';
import ethereum from './ethereum.json';
import fantom from './fantom.json';
import harmony from './harmony.json';
import moonriver from './moonriver.json';
import polygon from './polygon.json';
import xdai from './xdai.json';

export interface IToken {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  logoURI: string;
}

export const TOKENS: { [id: number]: IToken[] } = {
  [CHAIN_IDS.ARBITRUM]: arbitrum,
  [CHAIN_IDS.AVALANCHE]: avalanche,
  [CHAIN_IDS.BSC]: bsc,
  [CHAIN_IDS.CELO]: celo,
  [CHAIN_IDS.ETHEREUM]: ethereum,
  [CHAIN_IDS.FANTOM]: fantom,
  [CHAIN_IDS.HARMONY]: harmony,
  [CHAIN_IDS.MOONRIVER]: moonriver,
  [CHAIN_IDS.POLYGON]: polygon,
  [CHAIN_IDS.XDAI]: xdai,
};

export const WETH: { [id: number]: string } = {
  [CHAIN_IDS.ARBITRUM]: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
  [CHAIN_IDS.AVALANCHE]: '0xf20d962a6c8f70c731bd838a3a388D7d48fA6e15',
  [CHAIN_IDS.BSC]: '0x2170Ed0880ac9A755fd29B2688956BD959F933F8',
  [CHAIN_IDS.CELO]: '0xE919F65739c26a42616b7b8eedC6b5524d1e3aC4',
  [CHAIN_IDS.ETHEREUM]: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
  [CHAIN_IDS.FANTOM]: '0x74b23882a30290451A17c44f4F05243b6b58C76d',
  [CHAIN_IDS.HARMONY]: '0x6983D1E6DEf3690C4d616b13597A09e6193EA013',
  [CHAIN_IDS.MOONRIVER]: '0x639A647fbe20b6c8ac19E48E2de44ea792c62c5C',
  [CHAIN_IDS.POLYGON]: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
  [CHAIN_IDS.XDAI]: '0x6A023CCd1ff6F2045C3309768eAd9E68F978f6e1',
};

export const WNATIVE: { [id: number]: string } = {
  [CHAIN_IDS.ARBITRUM]: WETH[CHAIN_IDS.ARBITRUM],
  [CHAIN_IDS.AVALANCHE]: '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7',
  [CHAIN_IDS.BSC]: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
  [CHAIN_IDS.CELO]: '0x471EcE3750Da237f93B8E339c536989b8978a438',
  [CHAIN_IDS.ETHEREUM]: WETH[CHAIN_IDS.ETHEREUM],
  [CHAIN_IDS.FANTOM]: '0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83',
  [CHAIN_IDS.HARMONY]: '0xcF664087a5bB0237a0BAd6742852ec6c8d69A27a',
  [CHAIN_IDS.MOONRIVER]: '0xf50225a84382c74CbdeA10b0c176f71fc3DE0C4d',
  [CHAIN_IDS.POLYGON]: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
  [CHAIN_IDS.XDAI]: '0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d',
};

export function getToken(address: string, chainId: number): IToken {
  const token: IToken | undefined = TOKENS[chainId].find((token) => {
    return token.address.toLowerCase() === address.toLowerCase();
  });
  if (token !== undefined) return token;
  return {
    address: address,
    name: 'Unknow token',
    symbol: 'UT',
    decimals: 18,
    logoURI: '',
  };
}
