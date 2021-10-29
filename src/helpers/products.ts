import kashiLogo from "./../imports/images/products/kashi.png";
import bentoBoxLogo from "./../imports/images/products/bentoBox.png";

export interface IProduct {
    name: string,
    link: string,
    logo: string, //logo path
    description: string,
    active: boolean,
    networks: {[id: number]: string}
}

export const PRODUCTS: {[name: string]: IProduct} = {
    "Kashi": {
        name: "Kashi",
        link: "kashi",
        logo: kashiLogo,
        description: "Isolated lending and borrowing.",
        active: true,
        networks: {
            1: "",
            42161: "",
            43114: "",
            56: "",
            137: "",
            100: ""
        }
    },
    "BentoBox": {
        name: "BentoBox",
        link: "bentobox",
        logo: bentoBoxLogo,
        description: "Interest bearing vault.",
        active: true,
        networks: {
            1: "",
            42161: "",
            43114: "",
            56: "",
            137: "",
            100: ""
        }
    }
};