const Tokens = (): JSX.Element => {
  return (
    <>
      <button onClick={() => query()}>Query</button>
    </>
  );
};

const query = async () => {
  const res = await fetch(
    'https://api.zapper.fi/v1/apps/tokens/balances?api_key=96e0cc51-a62e-42ca-acee-910ea7d2a241&addresses%5B%5D=0x5434289767bb094dadbb8d1e5d58b47ca5729063&network=polygon'
  );
  console.log(await res.json());
};

export default Tokens;
