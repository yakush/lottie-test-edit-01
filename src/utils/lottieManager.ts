import EventEmitter from "events";
import { layerTypes } from "../enums";
import { LottieJson } from "../types/LottieJson";
import { LottieLayer, TextLayer } from "../types/LottieLayer";
import { LottieEditsConfig } from "../types/LottieEditsConfig";
import { LottieUtils } from "./lottieUtils";

export class LottieManager extends EventEmitter {
  private _url: string = "";
  private _origLottie?: LottieJson;
  private _editedLottie?: LottieJson;
  private _editConfigs?: LottieEditsConfig;

  // GETTERS ? SETTERS ?
  get url() {
    return this._url;
  }
  private set url(val) {
    this._url = val;
  }
  get origLottie() {
    return this._origLottie;
  }
  private set origLottie(val) {
    this._origLottie = val;
  }
  get editedLottie() {
    return this._editedLottie;
  }
  private set editedLottie(val) {
    this._editedLottie = val;
  }
  get editConfigs() {
    return this._editConfigs;
  }
  private set editConfigs(val) {
    this._editConfigs = val;
  }
  

  async loadUrl(url: string, urlEdits?: string): Promise<LottieJson> {
    try {
      this.url = url;
      this.origLottie = undefined;
      this.editedLottie = undefined;
      this.editConfigs = undefined;

      const resLottie = await fetch(url);
      const lottieJson = await resLottie.json();

      let jsonEdits = undefined;
      if (urlEdits) {
        const resEdits = await fetch(urlEdits);
        jsonEdits = await resEdits.json();
      }

      this.origLottie = lottieJson;
      this.editedLottie = { ...lottieJson };
      this.editConfigs = jsonEdits;

      this.digestLottie();

      return lottieJson;
    } catch (e) {
      throw e;
    }
  }

  async loadFile(file: File, editsFile?: File): Promise<LottieJson> {
    return new Promise<LottieJson>((resolve, reject) => {
      this.url = "";
      this.origLottie = undefined;
      this.editedLottie = undefined;
      this.editConfigs = undefined;

      const reader = new FileReader();

      reader.onabort = () => {
        console.log("file reading was aborted");
        this.origLottie = undefined;
        this.editedLottie = undefined;
        this.editConfigs = undefined;
        reject("file reading was aborted");
      };

      reader.onerror = () => {
        console.log("file reading has failed");
        this.origLottie = undefined;
        this.editedLottie = undefined;
        this.editConfigs = undefined;
        reject("file reading has failed");
      };

      reader.onload = () => {
        try {
          const str = reader.result as string;
          const json = JSON.parse(str);

          this.origLottie = json;
          this.editedLottie = { ...json };
          this.editConfigs = undefined;

          this.digestLottie();

          console.log(json);
          resolve(json);
        } catch (err) {
          console.log("JSON parsing failed");
          this.origLottie = undefined;
          this.editedLottie = undefined;
          this.editConfigs = undefined;
          reject("JSON parsing failedF");
        }
      };
      reader.readAsText(file);
    });
  }

  setLottieJson(json?: LottieJson) {}
  setEditsConfig(edits?: LottieEditsConfig) {}

  editColors(option: number, userDefinedColors?: string[]) {
    if (!this.editConfigs?.colorEdits?._edited) {
      return;
    }
    this.editConfigs.colorEdits._edited.selectedOption = option;
    if (userDefinedColors) {
      this.editConfigs.colorEdits._edited.userDefinedColors = userDefinedColors;
    }
    this.updateFromEdits();
  }

  editLayer(name: string, option: number) {
    const layerEdit = this.editConfigs?.layerEdits?.find(
      (item) => item.name === name
    );
    if (!layerEdit) {
      return;
    }
    if (layerEdit._edited) {
      layerEdit._edited.selectedOption = option;
    }
    this.updateFromEdits();
  }

  editText(name: string, text: string) {
    const layerEdit = this.editConfigs?.textEdits?.find(
      (item) => item.name === name
    );
    if (!layerEdit) {
      return;
    }
    if (layerEdit._edited) {
      layerEdit._edited.selectedText = text;
    }
    this.updateFromEdits();
  }

  //-------------------------------------------------------
  /**
   * prepare JSONs after loading them.
   * layer refs, color refs
   * JSON : add origs and stuff
   * JSON -> config refs etc.
   * @returns
   */
  private digestLottie() {
    if (!this.origLottie) {
      this.editedLottie = undefined;
      return;
    }

    //deep copy lottie
    this.editedLottie = structuredClone(this.origLottie);

    this.editedLottie?.layers?.forEach((layer) => {
      //save orig layer type
      layer._orig_ty = layer.ty;

      //save orig layer text
      if (layer.ty === layerTypes.text) {
        const layer_ = layer as TextLayer;

        if (layer_.t?.d?.k && layer_.t.d.k[0] && layer_.t.d.k[0].s?.t) {
          layer_.t.d.k[0].s._orig_t = layer_.t.d.k[0].s.t;
        }
      }

      //TODO: save orig layer color
      //...shape
      //...solid
      //...text
      //...?
    });

    // add fields:
    // layers - orig type
    // colors - orig hex color
    // texts -  orig text

    if (this.editConfigs?.colorEdits) {
      //target colors refs
      this.editConfigs.colorEdits.scheme.forEach((item) => {
        item._targets = [];
      });

      //default edits
      this.editConfigs.colorEdits._edited = {
        selectedOption: 0,
        userDefinedColors: [
          ...((this.editConfigs?.colorEdits?.options &&
            this.editConfigs.colorEdits.options[0] &&
            this.editConfigs.colorEdits.options[0].colors) ||
            []),
        ],
      };
    }

    if (this.editConfigs?.layerEdits) {
      this.editConfigs.layerEdits.forEach((item) => {
        //target refs
        item.options.forEach((option) => {
          option._targets = LottieUtils.findTargetArray(
            this.editedLottie,
            option.refs
          );
        });
        //default edits
        item._edited = {
          selectedOption: item.defaultOption || 0,
        };
      });
    }

    if (this.editConfigs?.textEdits) {
      this.editConfigs.textEdits.forEach((item) => {
        //target refs
        item._target = LottieUtils.findTarget(this.editedLottie, item.ref);
        //default edits
        item._edited = {
          selectedText: "orig text", //TODO: get from layer in lottie json
        };
      });
    }

    //perform initial edits
    this.updateFromEdits();
  }

  private updateFromEdits() {
    if (!this.editedLottie) {
      return;
    }
    if (!this.editConfigs) {
      return;
    }

    //color

    //layers
    if (this.editConfigs.layerEdits) {
      this.editConfigs.layerEdits.forEach((layerEdit) => {
        const selectedIdx = layerEdit._edited?.selectedOption;

        layerEdit.options.forEach((option, i) => {
          const hidden = i !== selectedIdx;
          option._targets?.forEach((target) => {
            LottieUtils.setLayerHidden(target, hidden);
          });
        });
      });
    }

    if (this.editConfigs.textEdits) {
      this.editConfigs.textEdits.forEach((edit) => {
        const targetLayer = edit._target as TextLayer;
        if (!targetLayer) {
          return;
        }
        if (!edit._edited?.selectedText) {
          return;
        }
        LottieUtils.setLayerText(targetLayer, edit._edited?.selectedText);
      });
    }

    //TODO: notify changed json
  }
}
