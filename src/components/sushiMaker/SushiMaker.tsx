import { useState } from "react";

export function SushiMaker(): JSX.Element {
  const [loading, setLoading] = useState(false);
  const [pairs, setPairs] = useState([]);

  return (
    <div className="container p-16 mx-auto text-center text-white">
      {loading && <div className={"text-white"}>loading data...</div>}
      <div className="grid grid-cols-6 py-8 bg-indigo-900 rounded-t-xl">
        <div className="">Pair</div>
        <div className="">Token A</div>
        <div className="">Token B</div>
        <div className="">Value</div>
      </div>
      {pairs.map((pair, i) => {
        return (
          <div
            key={i}
            className="grid grid-cols-6 py-4 bg-indigo-900 cursor-pointer bg-opacity-60 hover:bg-opacity-75"
          >
            <div className="">pair</div>
            <div className="">token a</div>
            <div className="">token b</div>
            <div className="">value</div>
          </div>
        );
      })}
    </div>
  );
}
