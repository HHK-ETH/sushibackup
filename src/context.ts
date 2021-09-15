import { createContext } from "react";

const f: Function = () => {}

export const PrivateKey = createContext({
    privateKey: '',
    setPrivateKey: f
});
export const PrivateKeyProvider = PrivateKey.Provider;