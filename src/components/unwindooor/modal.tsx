import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import UnwindPairs from './UnwindPairs';
import BuyWeth from './buyWeth';

const UnwindModal = ({
  openModal,
  setOpenModal,
  params,
}: {
  openModal: string;
  setOpenModal: Function;
  params: any;
}): JSX.Element => {
  return (
    <Transition.Root show={openModal !== ''} as={Fragment}>
      <Dialog
        as="div"
        static
        className="fixed inset-0 z-10 overflow-y-auto"
        open={openModal !== ''}
        // @ts-ignore
        onClose={() => setOpenModal('')}
      >
        <div className="flex items-end justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="inline-block overflow-hidden align-bottom transition-all transform rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="px-4 pt-5 pb-4 bg-indigo-900 sm:p-6 sm:pb-4">
                {openModal === 'unwind' && <UnwindPairs pairs={params.pairs} setTxPending={params.setTxPending} />}
                {openModal === 'buyWeth' && <BuyWeth setTxPending={params.setTxPending} />}
              </div>
              <div className="px-4 py-4 text-right bg-indigo-900">
                <button
                  type="button"
                  className="px-8 py-2 text-white bg-pink-500 rounded-full hover:bg-pink-600 text-md"
                  onClick={() => setOpenModal('')}
                >
                  Close
                </button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default UnwindModal;
