import "./App.css";
import LottieEditor from "./comps/LottieEditor/LottieEditor";
import LottieFileSelector from "./comps/LottieFileSelector/LottieFileSelector";
import LottiePlayer from "./comps/LottiePlayer/LottiePlayer";
import { useLottieContext } from "./LottieContext";

function App() {
  const lottie = useLottieContext();

  return (
    <div className="App">
      <header className="App-header">
        <div>EDITOR</div>
      </header>
      <main>
        <div className="editor-wrapper">
          <div className="player">
            {lottie.isLoading && <div>LOADING JSON</div>}
            {lottie.error && <div>ERROR LOADING</div>}
            {!lottie.isLoading && lottie.json && <LottiePlayer></LottiePlayer>}
          </div>
          <div className="editor">
            <LottieFileSelector />
            <hr />
            {!lottie.isLoading && lottie.json && <LottieEditor />}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
