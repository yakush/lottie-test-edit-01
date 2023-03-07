import React, { useState } from "react";
import "./App.css";
import { Player, Controls } from "@lottiefiles/react-lottie-player";
import lottieSamplesList from "./assets/lottie-sample-list.json";

// src="https://assets3.lottiefiles.com/packages/lf20_UJNc2t.json"

function App() {
  const [lottieIdx, setLottieIdx] = useState(0);
  const lottieItem = lottieSamplesList.samples[lottieIdx];
  const lottieUrl = `${process.env.PUBLIC_URL}/lottie-samples/${lottieItem.file}`;

  const handleSelect = (event: React.FormEvent) => {
    let v = (event.target as any).value;
    console.log("change lottie", v, lottieSamplesList.samples[v].name);
    setLottieIdx(v);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>HELLO</h1>
      </header>
      <main>
        <select
          name="selectLottie"
          id="selectLottie"
          value={lottieIdx}
          onChange={(event) => handleSelect(event)}
        >
          {lottieSamplesList.samples.map((item, i) => (
            <option key={item.name} value={i}>
              {item.name}
            </option>
          ))}
        </select>
        <div>{lottieUrl}</div>
        {/* <pre>{JSON.stringify(lottieSamplesList, null, 2)}</pre> */}
        <Player
          autoplay
          loop
          src={lottieUrl}
          style={{ height: "300px", width: "300px" }}
        >
          <Controls
            visible={true}
            buttons={["play", "repeat", "frame", "debug"]}
          />
        </Player>
      </main>
    </div>
  );
}

export default App;
