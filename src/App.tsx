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
        <div>LOTTIE EDITOR TEST</div>
      </header>
      <main className="App-main">
        <div className="editor-wrapper">
          <div className="player box">
            {lottie.isLoading && <div>LOADING JSON</div>}
            {!!lottie.error && <div>ERROR LOADING</div>}
            {!lottie.isLoading && lottie.json && <LottiePlayer />}
          </div>

          <div className="editor">
            <div className="editor-selector box">
              <LottieFileSelector />
            </div>

            <div className="editor-editor box">
              {!lottie.isLoading && lottie.json && <LottieEditor />}
            </div>
          </div>
        </div>
      </main>
      <footer className="App-footer">Made by Y@K</footer>
    </div>
  );
}

export default App;
