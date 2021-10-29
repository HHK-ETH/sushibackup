import React from "react";
import { PRODUCTS } from "../../helpers/products";
import { ProductBox } from "./ProductBox";

export function Home(): JSX.Element {
    return (
        <div className={"container mx-auto pt-16 p-4 grid grid-cols-4 gap-4"}>
            {
                Object.values(PRODUCTS).map((product) => {
                    return (
                        <ProductBox product={product}/>
                    )
                })
            }
        </div>
    );
}