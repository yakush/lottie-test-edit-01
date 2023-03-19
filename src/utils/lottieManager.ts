import { LottieJson } from "../types/LottieJson";
import { LottieEditsConfig } from "../types/LottieToingEdits";

export class LottieManager {
  private url: string = "";
  private origLottie?: LottieJson;
  private editedLottie?: LottieJson;
  private editConfigs?: LottieEditsConfig;

  async loadUrl(url: string, editsUrl?: string): Promise<LottieJson> {
    throw new Error("not implemented");
    // -> origLottie?: LottieJson;
    // -> editedLottie?: LottieJson;
    // -> editConfigs?: LottieToingEdits;
  }
  async loadFile(file: File, editsFile?: File): Promise<LottieJson> {
    throw new Error("not implemented");
    // -> origLottie?: LottieJson;
    // -> editedLottie?: LottieJson;
    // -> editConfigs?: LottieToingEdits;
  }

  setLottieJson(json?: LottieJson) {}
  setEditsConfig(edits?: LottieEditsConfig) {}

  edit() {}
}
