import kashiLightLogo from "./../imports/images/products/kashi-full-logo-light.png";
import bentoBoxLogo from "./../imports/images/products/bentoBox.png";

interface IProduct {
    name: string,
    link: string,
    logo: string, //logo path
    active: boolean
}

export const PRODUCTS: IProduct[] = [
    {
        name: "Kashi",
        link: "kashi",
        logo: kashiLightLogo,
        active: true
    },{
        name: "BentoBox",
        link: "bentobox",
        logo: bentoBoxLogo,
        active: true
    }
];