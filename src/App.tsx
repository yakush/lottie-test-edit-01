import "./App.css";
import LottieEditor from "./comps/LottieEditor";
import LottieFileSelector from "./comps/LottieFileSelector";
import LottiePlayer from "./comps/LottiePlayer";
import { useLottieContext } from "./LottieContext";

function App() {
  const lottie = useLottieContext();

  function dragOverHandler(ev) {
    console.log("File(s) in drop zone");
  
    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault();
  }
  
  function dropHandler(ev) {
    console.log("File(s) dropped");
  
    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault();
  
    if (ev.dataTransfer.items) {
      // Use DataTransferItemList interface to access the file(s)
      [...ev.dataTransfer.items].forEach((item, i) => {
        // If dropped items aren't files, reject them
        if (item.kind === "file") {
          const file = item.getAsFile();
          console.log(`… file[${i}].name = ${file.name}`);
        }
      });
    } else {
      // Use DataTransfer interface to access the file(s)
      [...ev.dataTransfer.files].forEach((file, i) => {
        console.log(`… file[${i}].name = ${file.name}`);
      });
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <div>LOTTIE EDITOR TEST</div>
        <div
          id="drop_zone"
          onDrop={dropHandler}
          onDragOver={dragOverHandler}
        >
          <p>
            Drag one or more files to this <i>drop zone</i>.
          </p>
        </div>
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
