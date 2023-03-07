import React, { useEffect, useState } from "react";
import "./App.css";
import { Player, Controls } from "@lottiefiles/react-lottie-player";
import lottieSamplesList from "./assets/lottie-sample-list.json";

// src="https://assets3.lottiefiles.com/packages/lf20_UJNc2t.json"

function App() {
  const [lottieIdx, setLottieIdx] = useState(0);
  const lottieItem = lottieSamplesList.samples[lottieIdx];
  const lottieUrl = `${process.env.PUBLIC_URL}/lottie-samples/${lottieItem.file}`;

  const [lottieJson, setLottieJson] = useState();

  useEffect(() => {
    (async () => {
      const res = await fetch(lottieUrl);
      if (res.ok) {
        const json = await res.json();
        setLottieJson(json);
        const names = json?.layers?.map((layer) => layer.nm);
        console.log(names);
      }
    })();
  }, [lottieUrl]);

  const handleSelect = async (event: React.FormEvent) => {
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
        <div className="editor-wrapper">
          {/* ---------------------------------------- */}
          <div className="player">
            <Player
              autoplay
              loop
              src={lottieUrl}
              // style={{ height: "300px", width: "300px" }}
            >
              <Controls
                visible={true}
                buttons={["play", "repeat", "frame", "debug"]}
              />
            </Player>
          </div>
          {/* ---------------------------------------- */}

          <div className="editor">
            <label htmlFor="selectLottie">select lottie</label>
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
            <div>
              {lottieItem.name} : {lottieItem.file}
            </div>

            {/* <pre>{JSON.stringify(lottieSamplesList, null, 2)}</pre> */}

            <hr />
            {lottieJson && <LottieFields json={lottieJson}></LottieFields>}
          </div>
        </div>
      </main>
    </div>
  );
}

//-------------------------------------------------------

function LottieFields({ json }) {
  const layers = json?.layers || [];

  return (
    <>
      <h3>{layers.length} layers</h3>
      <ul>
        {layers?.map((layer) => (
          <li
            style={{
              margin: 4,
              padding: 4,
              borderWidth: 1,
              borderColor: "black",
              borderStyle: "solid",
              borderRadius: 4,
            }}
          >
            <div>{layer.nm}</div>
            <div style={{ color: "gray" }}>
              {layer.shapes?.length || 0} shapes
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}

export default App;
