import "./App.css";
import LottieEditor from "./comps/LottieEditor";
import LottieFileSelector from "./comps/LottieFileSelector";
import LottiePlayer from "./comps/LottiePlayer";
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
            {!!lottie.error && <div>ERROR LOADING</div>}
            {!lottie.isLoading && lottie.json && <LottiePlayer />}
          </div>

          <div className="editor">
            <div className="editor-selector">
              <LottieFileSelector />
            </div>

            <div className="editor-editor">
              {!lottie.isLoading && lottie.json && <LottieEditor />}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
