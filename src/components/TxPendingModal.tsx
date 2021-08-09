import {Transition} from '@headlessui/react';
import Spinner from 'react-spinner-material';

export function TxPendingModal({txPending}: { txPending: string }) {

    return (
        <Transition
            show={txPending !== ''}
            enter="transition-opacity duration-75"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
        >
            <div className={"bg-white p-2 text-center shadow-2xl border rounded-lg absolute top-18 right-6"}>
                <a className={"underline text-blue-400"} href={'https://polygonscan.com/tx/'+txPending} target={"_blank"}>Transaction sent.</a>
                <h3>Waiting for 5 confirmations...</h3>
                <div className={"pl-20"}>
                    <Spinner radius={40} color={"#333"} stroke={2} visible={true}/>
                </div>
            </div>
        </Transition>
    )
}