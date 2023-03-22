import React, {
  createRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import styles from "./LottiePlayer.module.css";
import { Controls, Player } from "@lottiefiles/react-lottie-player";
import { AnimationItem } from "lottie-web";

import { useLottieContext } from "../LottieContext";
import useGifRenderer from "../useGifRenderer";
import Toggle from "./ui/Toggle";

type Props = {
  //children?: React.ReactNode;
};

const LottiePlayer: React.FC<Props> = ({}) => {
  const lottie = useLottieContext();
  const [playerRef, setPlayerRef] = useState<AnimationItem>();
  const [saveFileAfterRender, setSaveFileAfterRender] = useState(true);
  const [uploadFileAfterRender, setUploadFileAfterRender] = useState(false);

  const refCurrentTime = useRef(0);
  const refIsPaused = useRef(false);

  useEffect(() => {
    if (playerRef == null) {
      return;
    }
    const ref = playerRef;

    const handler = (e) => {
      refCurrentTime.current = e.currentTime / e.totalTime;
    };

    
    const handlerDestroy = (e) => {
      console.log('destroyed!!!!!!');
      
    };

    ref.addEventListener("enterFrame", handler);
    ref.addEventListener("destroy", handlerDestroy);

    const timer = setInterval(() => {
      refIsPaused.current = ref.isPaused;
    }, 100);

    return () => {
      try {
        ref.removeEventListener("enterFrame", handler);
      } catch (e) {}
      try {
        ref.addEventListener("destroy", handlerDestroy);
      } catch (e) {}

      clearInterval(timer);
    };
  }, [playerRef]);

  useEffect(() => {
    if (playerRef == null) {
      return;
    }
    if (lottie.json == null) {
      return;
    }

    if (refIsPaused.current) {
      playerRef.goToAndStop(
        refCurrentTime.current * playerRef.totalFrames,
        true
      );
    } else {
      playerRef.goToAndPlay(
        refCurrentTime.current * playerRef.totalFrames,
        true
      );
    }
  }, [playerRef, lottie.json]);

  const onFinishRender = useCallback(
    (blob: Blob, data: Uint8Array) => {
      //save to file:
      if (saveFileAfterRender) {
        saveFile()
          .then(() => console.log("saved"))
          .catch(console.error);
      }
      if (uploadFileAfterRender) {
        uploadToServer()
          .then(() => console.log("uploaded"))
          .catch(console.error);
      }

      async function saveFile() {
        const filename = "test.gif";
        if (window.navigator["msSaveOrOpenBlob"])
          // IE10+
          window.navigator["msSaveOrOpenBlob"](blob, filename);
        else {
          // Others
          const a = document.createElement("a");
          const url = URL.createObjectURL(blob);
          a.href = url;
          a.download = filename;
          document.body.appendChild(a);
          a.click();
          setTimeout(() => {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
          }, 0);
        }
      }

      //upload to server:
      async function uploadToServer() {
        const formData = new FormData();
        formData.append("content", blob, "test.gif");

        try {
          const response = await fetch("http://localhost:3001/api/upload", {
            method: "POST",
            body: formData,
          });
          const data = await response.json();
          console.log(data);
        } catch (err) {
          console.error(err);
        }
      }
    },
    [saveFileAfterRender, uploadFileAfterRender]
  );

  const [setInstance, startRender, isRendering, renderProgress] =
    useGifRenderer(onFinishRender);

  function renderGif() {
    if (isRendering) {
      return;
    }
    startRender();
  }

  return (
    <div className={styles.root}>
      <div className={styles.renderForm}>
        <button disabled={isRendering} onClick={renderGif}>
          render
        </button>
        <div>
          <Toggle
            label="save file after render"
            checked={saveFileAfterRender}
            onChange={() => setSaveFileAfterRender((x) => !x)}
          />
        </div>
        <div>
          <Toggle
            label="upload file to server after render"
            checked={uploadFileAfterRender}
            onChange={() => setUploadFileAfterRender((x) => !x)}
          />
        </div>
        {/* {isRendering ? "RENDER" : "NOT RENDER"} */}
        {isRendering && (
          <div>
            <progress value={renderProgress * 100} max="100" />
            <div>rendering progress :{Math.round(renderProgress * 100)}%</div>
          </div>
        )}
      </div>
      <Player
        lottieRef={(instance) => {
          setPlayerRef(instance);
          setInstance(instance);
        }}
        className={styles.player}
        // lottieRef={ref}
        // renderer="canvas"
        autoplay
        loop
        src={lottie.json || ""}
        // style={{ height: "300px", width: "300px" }}
      >
        <Controls
          visible={!isRendering}
          buttons={["play", "repeat", "frame", "debug"]}
        />
      </Player>
    </div>
  );
};

export default LottiePlayer;
