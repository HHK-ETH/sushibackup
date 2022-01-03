import { CHAIN_IDS } from './network';
import kashiLogo from '../imports/images/products/kashi.png';
import bentoBoxLogo from '../imports/images/products/bentoBox.png';
import sushiMakerLogo from '../imports/images/products/sushiMaker.png';
import farmLogo from '../imports/images/products/farm.jpeg';
import kashiABI from '../imports/abis/kashi.json';
import bentoBoxABI from '../imports/abis/bento.json';
import boringHelperABI from '../imports/abis/boringhelper.json';
import sushiFactoryABI from '../imports/abis/sushiFactory.json';
import wethMaker from '../imports/abis/wethMaker.json';
import minichef from '../imports/abis/minichef.json';
import masterchef from '../imports/abis/masterchef.json';

export interface IProduct {
  name: string;
  link: string;
  logo: string; // logo path
  description: string;
  active: boolean;
  networks: { [id: number]: string };
  ABI: any;
}

export enum PRODUCT_IDS {
  KASHI = 0,
  BENTOBOX = 1,
  BORING_HELPER = 2,
  SUSHI_MAKER = 3,
  UNWINDOOOR = 4,
  MASTERCHEF = 5,
  MINICHEF = 6,
}

export const PRODUCTS: { [id: number]: IProduct } = {
  [PRODUCT_IDS.KASHI]: {
    name: 'Kashi',
    link: 'kashi',
    logo: kashiLogo,
    description: 'Isolated lending and borrowing.',
    active: false,
    networks: {
      [CHAIN_IDS.ETHEREUM]: '0x2cba6ab6574646badc84f0544d05059e57a5dc42',
      [CHAIN_IDS.ARBITRUM]: '0xa010ee0226cd071bebd8919a1f675cae1f1f5d3e',
      [CHAIN_IDS.BSC]: '0x2cba6ab6574646badc84f0544d05059e57a5dc42',
      [CHAIN_IDS.POLYGON]: '0xb527c5295c4bc348cbb3a2e96b2494fd292075a7',
      [CHAIN_IDS.XDAI]: '0x7a6da9903d0a481f40b8336c1463487bc8c0407e',
    },
    ABI: kashiABI,
  },
  [PRODUCT_IDS.BENTOBOX]: {
    name: 'BentoBox',
    link: 'bentobox',
    logo: bentoBoxLogo,
    description: 'Interest bearing vault.',
    active: false,
    networks: {
      [CHAIN_IDS.ETHEREUM]: '0xf5bce5077908a1b7370b9ae04adc565ebd643966',
      [CHAIN_IDS.ARBITRUM]: '0x74c764D41B77DBbb4fe771daB1939B00b146894A',
      [CHAIN_IDS.BSC]: '0xf5bce5077908a1b7370b9ae04adc565ebd643966',
      [CHAIN_IDS.POLYGON]: '0x0319000133d3ada02600f0875d2cf03d442c3367',
      [CHAIN_IDS.XDAI]: '0xE2d7F5dd869Fc7c126D21b13a9080e75a4bDb324',
    },
    ABI: bentoBoxABI,
  },
  [PRODUCT_IDS.BORING_HELPER]: {
    name: 'BoringHelper',
    link: '',
    logo: '',
    description: '',
    active: false,
    networks: {
      [CHAIN_IDS.AVALANCHE]: '0xbc2c69175e9b379ECF64Dc23CcA70Bd7DC99093e',
      [CHAIN_IDS.ARBITRUM]: '0x37B3287292De241278fB5FCa514a756E0BE924f8',
      [CHAIN_IDS.BSC]: '0x11Ca5375AdAfd6205E41131A4409f182677996E6',
      [CHAIN_IDS.CELO]: '0x07C9040Cd1bA51e7D062442BA9b0B6794b3Cda6B',
      [CHAIN_IDS.ETHEREUM]: '0x11Ca5375AdAfd6205E41131A4409f182677996E6',
      [CHAIN_IDS.FANTOM]: '0xB46217aF1Eb975e616108af0bEe28D9FD22D6F2C',
      [CHAIN_IDS.HARMONY]: '0xF06EE11dDc521c6F1Fb4542cCd8162BE8c54bDc9',
      [CHAIN_IDS.MOONRIVER]: '0xafB28FC404B8F8837713bd60416E566c3720Ed9f',
      [CHAIN_IDS.POLYGON]: '0xA77a7fD5a16237B85E0FAd02C51f459D18AE93Cd',
      [CHAIN_IDS.XDAI]: '0x97e4a0fb71243A83A6FbaEF7Cf73617594e4cF2F',
    },
    ABI: boringHelperABI,
  },
  [PRODUCT_IDS.SUSHI_MAKER]: {
    name: 'SushiMaker',
    link: 'sushimaker',
    logo: sushiMakerLogo,
    description: 'See how much fees available for the SushiBar.',
    active: true,
    networks: {
      [CHAIN_IDS.ARBITRUM]: '0xc35DADB65012eC5796536bD9864eD8773aBc74C4',
      [CHAIN_IDS.AVALANCHE]: '0xc35DADB65012eC5796536bD9864eD8773aBc74C4',
      [CHAIN_IDS.BSC]: '0xc35DADB65012eC5796536bD9864eD8773aBc74C4',
      [CHAIN_IDS.CELO]: '0xc35DADB65012eC5796536bD9864eD8773aBc74C4',
      [CHAIN_IDS.ETHEREUM]: '0xC0AEe478e3658e2610c5F7A4A2E1777cE9e4f2Ac',
      [CHAIN_IDS.FANTOM]: '0xc35DADB65012eC5796536bD9864eD8773aBc74C4',
      [CHAIN_IDS.HARMONY]: '0xc35DADB65012eC5796536bD9864eD8773aBc74C4',
      [CHAIN_IDS.MOONRIVER]: '0xc35DADB65012eC5796536bD9864eD8773aBc74C4',
      [CHAIN_IDS.POLYGON]: '0xc35DADB65012eC5796536bD9864eD8773aBc74C4',
      [CHAIN_IDS.XDAI]: '0xc35DADB65012eC5796536bD9864eD8773aBc74C4',
    },
    ABI: sushiFactoryABI,
  },
  [PRODUCT_IDS.UNWINDOOOR]: {
    name: 'Unwindooor',
    link: 'unwindooor',
    logo: sushiMakerLogo,
    description: 'Remove liquidity to serve the bar.',
    active: true,
    networks: {
      [CHAIN_IDS.ARBITRUM]: '0xa19b3b22f29E23e4c04678C94CFC3e8f202137d8',
      [CHAIN_IDS.AVALANCHE]: '0x560C759A11cd026405F6f2e19c65Da1181995fA2',
      [CHAIN_IDS.BSC]: '0x4736c58BfB626C96D344Be2fC04e420aE283E9E8',
      [CHAIN_IDS.CELO]: '0xB6E90eBe44De40aEb0b987adC2D7d9dd0EC918d7',
      [CHAIN_IDS.ETHEREUM]: '0x5ad6211CD3fdE39A9cECB5df6f380b8263d1e277',
      [CHAIN_IDS.FANTOM]: '0x4736c58BfB626C96D344Be2fC04e420aE283E9E8',
      [CHAIN_IDS.HARMONY]: '0x560C759A11cd026405F6f2e19c65Da1181995fA2',
      [CHAIN_IDS.MOONRIVER]: '0xa19b3b22f29E23e4c04678C94CFC3e8f202137d8',
      [CHAIN_IDS.POLYGON]: '0xf1c9881Be22EBF108B8927c4d197d126346b5036',
      [CHAIN_IDS.XDAI]: '',
    },
    ABI: wethMaker,
  },
  [PRODUCT_IDS.MASTERCHEF]: {
    name: 'Farm',
    link: 'farm',
    logo: farmLogo,
    description: 'Stake/unstake SLPs and earn sushi rewards.',
    active: true,
    networks: {
      [CHAIN_IDS.ETHEREUM]: '0xc2edad668740f1aa35e4d8f227fb8e17dca888cd',
    },
    ABI: masterchef,
  },
  [PRODUCT_IDS.MINICHEF]: {
    name: '',
    link: '',
    logo: '',
    description: '',
    active: false,
    networks: {
      [CHAIN_IDS.ETHEREUM]: '0xef0881ec094552b2e128cf945ef17a6752b4ec5d', //mcv2
      [CHAIN_IDS.ARBITRUM]: '0xf4d73326c13a4fc5fd7a064217e12780e9bd62c3',
      [CHAIN_IDS.CELO]: '0x0769fd68dfb93167989c6f7254cd0d766fb2841f',
      [CHAIN_IDS.HARMONY]: '0x67da5f2ffaddff067ab9d5f025f8810634d84287',
      [CHAIN_IDS.MOONRIVER]: '0x3db01570d97631f69bbb0ba39796865456cf89a5',
      [CHAIN_IDS.POLYGON]: '0x0769fd68dfb93167989c6f7254cd0d766fb2841f',
      [CHAIN_IDS.XDAI]: '0xddcbf776df3de60163066a5dddf2277cb445e0f3',
    },
    ABI: minichef,
  },
};
