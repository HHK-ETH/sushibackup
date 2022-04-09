import Modal from '../general/Modal';

const Withdraw = ({ open, setOpen, vault }: { open: boolean; setOpen: Function; vault: any }): JSX.Element => {
  if (vault === null) return <></>;
  return (
    <Modal open={open} setOpen={setOpen}>
      <>OKOK</>
    </Modal>
  );
};

export default Withdraw;
