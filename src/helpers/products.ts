import kashiLogo from "./../imports/images/products/kashi.png";
import bentoBoxLogo from "./../imports/images/products/bentoBox.png";

export interface IProduct {
    name: string,
    link: string,
    logo: string, //logo path
    description: string,
    active: boolean
}

export const PRODUCTS: IProduct[] = [
    {
        name: "Kashi",
        link: "kashi",
        logo: kashiLogo,
        description: "Isolated lending and borrowing.",
        active: true
    },
    {
        name: "BentoBox",
        link: "bentobox",
        logo: bentoBoxLogo,
        description: "Interest bearing vault.",
        active: true
    }
];