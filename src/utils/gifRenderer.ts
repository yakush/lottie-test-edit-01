import { EventEmitter } from "events";
import GIF from "gif.js";

import { AnimationItem } from "lottie-web";

const FRAME_ADD_DELAY = 1;
const DEBUG = false;

function logDebug(...args: any[]) {
  if (DEBUG) {
    console.log(...args);
  }
}

function createPublicUrl(file: string) {
  return `${process.env.PUBLIC_URL}/${file}`;
}

class GifRenderer extends EventEmitter {
  private gif: GIF;
  private animationItem: AnimationItem;
  private svg: SVGElement;
  private fps = 25;

  private totalFrames = 0;
  private frame = 0;
  private isStarted = false;

  private saved_currentFrame: number = 0;
  private saved_isPaused: boolean = false;

  constructor({
    width,
    height,
    animationItem,
    fps = 25,
  }: {
    width: number;
    height: number;
    animationItem: AnimationItem;
    fps?: number;
  }) {
    super();
    this.gif = new GIF({
      workerScript: createPublicUrl("gif.worker.js"),
      width,
      height,
      //workers: 2,
      quality: 3,
      background: "#fff",
    });
    this.animationItem = animationItem;
    this.svg = animationItem.renderer.svgElement;
    this.fps = fps;
  }

  //   emit(eventName: string | symbol, ...args: any[]): boolean {
  //     console.log("EMItTING", eventName);
  //     return super.emit(eventName, ...args);
  //   }

  start() {
    if (this.isStarted) {
      throw new Error("Gif renderer already started");
    }

    this.totalFrames = this.animationItem.totalFrames;
    this.frame = 0;

    logDebug("totalFrames :", this.totalFrames);
    logDebug("frameRate :", this.animationItem.frameRate);
    logDebug("width:", +(this.svg?.getAttribute("width") || 100));
    logDebug("height:", +(this.svg?.getAttribute("height") || 100));

    this.isStarted = true;

    //save state:
    this.saveState();

    this.gif.on("start", () => this.handleStart);
    this.gif.on("progress", (progress) => this.handleProgress(progress));
    this.gif.on("finished", (blob, data) => this.handleFinished(blob, data));
    this.gif.on("abort", () => this.handleAbort());

    //start:
    this.emit("start");
    this.emit("progress", 0);
    this.addFrame();
  }

  abort() {
    this.gif.abort();
  }

  //-------------------------------------------------------
  //event handlers
  private handleStart() {
    this.emit("start");
  }
  private handleProgress(progress: number) {
    //note: half is images, half is gif render
    this.emit("progress", 0.5 + progress / 2);
  }
  private handleFinished(blob: Blob, data: Uint8Array) {
    this.restoreState();
    this.emit("finished", blob, data);
  }
  private handleAbort() {
    this.restoreState();
    this.emit("abort");
  }

  //-------------------------------------------------------
  private saveState() {
    this.saved_currentFrame = this.animationItem.currentFrame;
    this.saved_isPaused = this.animationItem.isPaused;
  }

  private restoreState() {
    if (this.saved_isPaused) {
      this.animationItem.goToAndStop(this.saved_currentFrame, true);
    } else {
      this.animationItem.goToAndPlay(this.saved_currentFrame, true);
    }
  }

  private addFrame() {
    logDebug("frame", this.frame);

    this.animationItem.goToAndStop(this.frame, true);
    const img = new Image();
    const serialized = new XMLSerializer().serializeToString(this.svg);
    const svgBlob = new Blob([serialized], { type: "image/svg+xml" });
    const url = URL.createObjectURL(svgBlob);

    const imageFrame = this.frame;
    img.onload = () => {
      this.gif.addFrame(img, {
        delay: 1000 / this.fps,
        copy: true,
      });

      setTimeout(() => {
        if (imageFrame + 1 >= this.totalFrames) {
          this.finish();
        } else {
          //note: half is images, half is gif render
          this.emit("progress", 0.5 * (imageFrame / this.totalFrames));
          this.addFrame();
        }
      }, FRAME_ADD_DELAY);
    };

    img.src = url;
    this.frame++;
  }

  private finish() {
    this.gif.render();
  }
}

export default GifRenderer;
