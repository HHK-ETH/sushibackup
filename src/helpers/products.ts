import kashiLogo from "./../imports/images/products/kashi.png";
import bentoBoxLogo from "./../imports/images/products/bentoBox.png";
import kashiABI from "./../imports/abis/kashi.json";
import bentoBoxABI from "./../imports/abis/bento.json";
import boringHelperABI from "./../imports/abis/boringhelper.json";
import kashiPairsEthereum from "./../imports/kashiPairs/ethereum.json";
import kashiPairsArbitrum from "./../imports/kashiPairs/arbitrum.json";
import kashiPairsBsc from "./../imports/kashiPairs/bsc.json";
import kashiPairsPolygon from "./../imports/kashiPairs/polygon.json";
import kashiPairsXdai from "./../imports/kashiPairs/xdai.json";

export interface IProduct {
    name: string,
    link: string,
    logo: string, //logo path
    description: string,
    active: boolean,
    networks: {[id: number]: string}
    ABI: any
}

export interface IToken {
    address: string,
    name: string,
    symbol: string,
    decimals: number,
    logoURI: string
}

export interface IKashiPairData {
    address: string,
    asset: IToken,
    collateral: IToken,
    lendAPR: number,
    borrowAPR: number
    utilization: number
}

export const KASHI_PAIRS: {[id: number]: string[]} = {
    1: kashiPairsEthereum,
    42161: kashiPairsArbitrum,
    56: kashiPairsBsc,
    137: kashiPairsPolygon,
    100: kashiPairsXdai
}

export const PRODUCTS: {[name: string]: IProduct} = {
    "Kashi": {
        name: "Kashi",
        link: "kashi",
        logo: kashiLogo,
        description: "Isolated lending and borrowing.",
        active: true,
        networks: {
            1: "0x2cba6ab6574646badc84f0544d05059e57a5dc42",
            42161: "0xa010ee0226cd071bebd8919a1f675cae1f1f5d3e",
            56: "0x2cba6ab6574646badc84f0544d05059e57a5dc42",
            137: "0xb527c5295c4bc348cbb3a2e96b2494fd292075a7",
            100: "0x7a6da9903d0a481f40b8336c1463487bc8c0407e"
        },
        ABI: kashiABI
    },
    "BentoBox": {
        name: "BentoBox",
        link: "bentobox",
        logo: bentoBoxLogo,
        description: "Interest bearing vault.",
        active: true,
        networks: {
            1: "0xf5bce5077908a1b7370b9ae04adc565ebd643966",
            42161: "0x74c764D41B77DBbb4fe771daB1939B00b146894A",
            56: "0xf5bce5077908a1b7370b9ae04adc565ebd643966",
            137: "0x0319000133d3ada02600f0875d2cf03d442c3367",
            100: "0xE2d7F5dd869Fc7c126D21b13a9080e75a4bDb324"
        },
        ABI: bentoBoxABI
    },
    "BoringHelper": {
        name: "BoringHelper",
        link: "",
        logo: "",
        description: "",
        active: false,
        networks: {
            1: "0x11Ca5375AdAfd6205E41131A4409f182677996E6",
            42161: "0x37B3287292De241278fB5FCa514a756E0BE924f8",
            56: "0x11Ca5375AdAfd6205E41131A4409f182677996E6",
            137: "0xA77a7fD5a16237B85E0FAd02C51f459D18AE93Cd",
            100: "0x97e4a0fb71243A83A6FbaEF7Cf73617594e4cF2F"
        },
        ABI: boringHelperABI
    }
};