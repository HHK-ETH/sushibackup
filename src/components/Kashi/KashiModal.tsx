import { Dialog, Transition } from "@headlessui/react";
import React, { Fragment } from "react";
import { IKashiPairData } from "../../imports/kashiPairs";

export function KashiModal({
  open,
  setOpen,
  pair,
}: {
  open: boolean;
  setOpen: Function;
  pair: IKashiPairData;
}): JSX.Element {
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        static
        className="fixed inset-0 z-10 overflow-y-auto"
        open={open}
        // @ts-ignore
        onClose={setOpen}
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
          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
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
            <div className="inline-block overflow-hidden text-left align-bottom transition-all transform bg-indigo-900 rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="px-4 pt-5 pb-4 bg-indigo-900 sm:p-6 sm:pb-4">
                {pair !== undefined && (
                  <div className="text-center text-white">
                    <div>
                      <h2 className="mb-2 text-xl">Your lending position</h2>
                      <div className="m-2">
                        <img
                          className="inline-block h-10 mr-2"
                          alt="logo"
                          src={pair.asset.logoURI}
                        />
                        {pair.asset.symbol} lent: {pair.userAsset.toFixed(2)}
                      </div>
                      <button
                        type="button"
                        className="px-8 py-2 text-white bg-pink-500 rounded-full hover:bg-pink-600 text-md"
                        onClick={() => {}}
                      >
                        Withdraw
                      </button>
                    </div>
                    <div>
                      <h2 className="mb-2 text-xl">You borrowing position</h2>
                    </div>
                  </div>
                )}
              </div>
              <div className="px-4 py-4 text-right bg-indigo-900">
                <button
                  type="button"
                  className="px-8 py-2 text-white bg-pink-500 rounded-full hover:bg-pink-600 text-md"
                  onClick={() => setOpen(false)}
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
}
