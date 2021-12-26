const Slippage = ({ slippage, setSlippage }: { slippage: number; setSlippage: Function }): JSX.Element => {
  return (
    <div className="grid grid-cols-4 gap-4">
      <p>Max slippage:</p>
      {[0.1, 0.5, 1].map((value, index) => {
        return (
          <button
            className={
              slippage === value
                ? 'text-lg font-medium text-white rounded-full bg-purple-700'
                : 'text-lg font-medium text-white rounded-full bg-pink-500 hover:bg-pink-600'
            }
            onClick={() => {
              setSlippage(value);
            }}
            key={index}
          >
            {value}%%
          </button>
        );
      })}
    </div>
  );
};

export default Slippage;
