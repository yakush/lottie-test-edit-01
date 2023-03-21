import React, { useCallback, useEffect, useState } from "react";
import { AnimationItem } from "lottie-web";
import GifRenderer from "./utils/gifRenderer";

function useGifRenderer(
  onFinish?: (blob: Blob, data: Uint8Array) => void
): [
  React.Dispatch<React.SetStateAction<AnimationItem | undefined>>,
  () => void,
  boolean,
  number
] {
  const [instance, setInstance] = useState<AnimationItem>();
  const [isRendering, setIsRendering] = useState(false);
  const [progress, setProgress] = useState(0);

  const startRender = useCallback(() => {
    console.log("render!");

    if (!instance) {
      console.warn("no animation item element found!");
      return;
    }
    const svgNode = instance?.renderer?.svgElement as SVGElement;
    if (!svgNode) {
      console.warn("no SVG element found!");
      return;
    }

    const gif = new GifRenderer({
      animationItem: instance,
      width: +(svgNode.getAttribute("width") || 100),
      height: +(svgNode.getAttribute("height") || 100),
      fps: instance.frameRate,
    });

    // gif.on("abort", (...args) => console.log("abort", ...args));
    // gif.on("finished", (...args) => console.log("finished", ...args));
    // gif.on("progress", (...args) => console.log("progress", ...args));
    // gif.on("start", (...args) => console.log("start", ...args));

    gif.on("start", () => {
      setProgress(0);
      setIsRendering(true);
    });
    gif.on("progress", (progress) => {
      setProgress(progress);
    });
    gif.on("abort", () => {
      setProgress(0);
      setIsRendering(false);
    });
    gif.on("finished", (blob, data) => {
      setIsRendering(false);

      onFinish && onFinish(blob, data);
    });

    gif.start();
  }, [instance, onFinish]);

  return [setInstance, startRender, isRendering, progress];
}

export default useGifRenderer;
