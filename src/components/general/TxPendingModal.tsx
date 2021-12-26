import { Transition } from '@headlessui/react';
import Spinner from 'react-spinner-material';

const TxPendingModal = ({ txPending }: { txPending: string }): JSX.Element => {
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
      <div className={'bg-pink-500 text-white p-2 text-center shadow-2xl rounded-lg absolute top-18 right-6'}>
        <a className={'underline'} href={txPending} target={'_blank'} rel={'noreferrer'}>
          Transaction sent.
        </a>
        <h3>Waiting for confirmation...</h3>
        <div className={'pl-20'}>
          <Spinner radius={40} color={'#333'} stroke={2} visible={true} />
        </div>
      </div>
    </Transition>
  );
};

export default TxPendingModal;
