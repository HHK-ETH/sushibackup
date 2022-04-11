import bentoBoxLogo from '../imports/images/products/bentoBox.png';
import sushiMakerLogo from '../imports/images/products/sushiMaker.png';
import xsushi from '../imports/images/products/xsushi.png';
import farmLogo from '../imports/images/products/farm.jpeg';
import tridentLogo from '../imports/images/products/trident.jpeg';
import dcaLogo from '../imports/images/products/dca.png';
import tridentABI from '../imports/abis/trident.json';
import bentoBoxABI from '../imports/abis/bento.json';
import sushiFactoryABI from '../imports/abis/sushiFactory.json';
import wethMaker from '../imports/abis/wethMaker.json';
import masterchef from '../imports/abis/masterchef.json';

export interface IProduct {
  name: string;
  link: string;
  logo: string; // logo path
  description: string;
  active: boolean;
  ABI: any;
}

export enum PRODUCT_IDS {
  MASTERCHEF = 0,
  BENTOBOX = 1,
  KASHI = 2,
  FEES = 3,
  UNWINDOOOR = 4,
  TRIDENT = 5,
  DCA = 6,
}

export const PRODUCTS: { [id: number]: IProduct } = {
  [PRODUCT_IDS.MASTERCHEF]: {
    name: 'Farm',
    link: 'farm',
    logo: farmLogo,
    description: 'Stake/unstake SLPs and earn sushi rewards.',
    active: true,
    ABI: masterchef,
  },
  [PRODUCT_IDS.BENTOBOX]: {
    name: 'BentoBox',
    link: 'bentobox',
    logo: bentoBoxLogo,
    description: 'Interest bearing vault.',
    active: true,
    ABI: bentoBoxABI,
  },
  [PRODUCT_IDS.FEES]: {
    name: 'xSUSHI fees',
    link: 'fees',
    logo: xsushi,
    description: 'See how much fees available for the SushiBar.',
    active: true,
    ABI: sushiFactoryABI,
  },
  [PRODUCT_IDS.UNWINDOOOR]: {
    name: 'Unwindooor',
    link: 'unwindooor',
    logo: sushiMakerLogo,
    description: 'Remove liquidity to serve the bar.',
    active: true,
    ABI: wethMaker,
  },
  [PRODUCT_IDS.TRIDENT]: {
    name: 'Trident',
    link: 'trident',
    logo: tridentLogo,
    description: 'Remove liquidity from trident.',
    active: true,
    ABI: tridentABI,
  },
  [PRODUCT_IDS.DCA]: {
    name: 'DCA',
    link: 'dca',
    logo: dcaLogo,
    description: 'Create and manage DCA vaults.',
    active: false,
    ABI: '',
  },
};
