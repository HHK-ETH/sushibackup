import React from "react";
import {Link} from "react-router-dom";
import faq from "./../faq.json";

export function Home(): JSX.Element {
    return (
        <div className={"text-center p-4"}>
            <div className={"mt-8 mb-20"}>
                <h1 className={"text-3xl"}>Welcome to sushibackup.com</h1>
                <p className={"text-xl"}>A list of different tools to help users when the official UI is down</p>
                <a target={"_blank"} href={"https://github.com/HHK-ETH/sushibackup"} className={"block underline text-blue-500 text-sm"}>Github</a>
            </div>
            <Link to={"/bento"}>
                <button
                    type="button"
                    className="justify-center rounded-md border border-gray-300 shadow-sm px-8 py-4 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-2xl"
                >Go to Bento
                </button>
            </Link>
            <Link to={"/miso"}>
                <button
                    type="button"
                    className="justify-center rounded-md border border-gray-300 shadow-sm px-8 py-4 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-2xl"
                >Go to Miso
                </button>
            </Link>
            <Link to={"/masterchef"}>
                <button
                    type="button"
                    className="justify-center rounded-md border border-gray-300 shadow-sm px-8 py-4 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-2xl"
                >Go to Masterchef
                </button>
            </Link>
            <div className={"mt-24"}>
                <h1 className={"text-3xl font-bold m-2"}>FAQ</h1>
                {faq.map((element) => {
                    return (
                        <>
                            <h3 className={"text-xl font-bold"}>{element.question}</h3>
                            <p className={"mb-2 whitespace-pre-line"}>{element.answer}</p>
                        </>
                    );
                })}
            </div>
        </div>
    );
}