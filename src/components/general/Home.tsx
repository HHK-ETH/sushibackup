import React from "react";
import { PRODUCTS } from "../../helpers/products";

export function Home(): JSX.Element {
    return (
        <div className={"text-center p-4"}>
            {
                PRODUCTS.map((product) => {
                    return (
                        <div>
                            {product.name}
                        </div>
                    )
                })
            }
        </div>
    );
}