import React from 'react';

const TxPending = React.createContext({
  txPending: '',
  setTxPending: (link: string) => {},
});

export { TxPending };
