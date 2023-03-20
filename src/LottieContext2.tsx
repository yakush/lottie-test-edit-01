import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { LottieJson } from "./types/LottieJson";
import { LottieEditsConfig } from "./types/LottieEditsConfig";
import { LottieManager } from "./utils/lottieManager";

export interface ILottieContext {
  lottieManager?: LottieManager;
  url: string;
  json?: LottieJson;
  editsJson?: LottieEditsConfig;
  isLoading: boolean;
  error?: unknown;
  loadUrl: (url: string, editsUrl?: string) => Promise<LottieJson>;
  loadFile: (file: File, editsFile?: File) => Promise<LottieJson>;
}
const initialState: ILottieContext = {
  lottieManager: undefined,
  url: "",

  json: undefined,
  editsJson: undefined,

  isLoading: false,
  error: undefined,
  loadUrl: () => Promise.reject<LottieJson>(),
  loadFile: () => Promise.reject<LottieJson>(),
};

const LottieContext = React.createContext<ILottieContext>(initialState);

const LottieContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const lottieManager = useRef(new LottieManager());

  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<unknown>();

  const [json, setJson] = useState<LottieJson>();
  const [editsJson, setEditsJson] = useState<LottieEditsConfig>();

  useEffect(() => {
    console.log({ json });
  }, [json]);

  useEffect(() => {
    console.log({ editsJson });
  }, [editsJson]);

  useEffect(() => {
    const mgr = lottieManager.current;

    const handleChangeLottie = (json: LottieJson) => {
      setJson(json);
    };
    const handleChangeEdits = (edits: LottieEditsConfig) => {
      setEditsJson(edits);
    };

    mgr.on("changeLottie", handleChangeLottie);
    mgr.on("changeEdits", handleChangeEdits);

    return () => {
      mgr.off("changeLottie", handleChangeLottie);
      mgr.off("changeEdits", handleChangeEdits);
    };
  }, []);

  const loadUrl = async (url: string, editsUrl?: string) => {
    try {
      setIsLoading(true);
      setError(undefined);
      setJson(undefined);
      setEditsJson(undefined);

      const res = await lottieManager.current.loadUrl(url, editsUrl);
      setIsLoading(false);
      setError(undefined);
      setJson(lottieManager.current.editedLottie);
      setEditsJson(lottieManager.current.editConfigs);
      return res;
    } catch (err) {
      setIsLoading(false);
      setError(err);
      setJson(undefined);
      setEditsJson(undefined);
      throw err;
    }
  };

  const loadFile = async (file: File, editsFile?: File) => {
    try {
      setIsLoading(true);
      setError(undefined);
      setJson(undefined);
      setEditsJson(undefined);

      const res = await lottieManager.current.loadFile(file, editsFile);
      setIsLoading(false);
      setError(undefined);
      setJson(lottieManager.current.editedLottie);
      setEditsJson(lottieManager.current.editConfigs);
      return res;
    } catch (err) {
      setIsLoading(false);
      setError(err);
      setJson(undefined);
      setEditsJson(undefined);
      throw err;
    }
  };

  return (
    <LottieContext.Provider
      value={{
        lottieManager: lottieManager.current,
        url,
        isLoading,
        error,
        json,
        editsJson,
        loadUrl,
        loadFile,
      }}
    >
      {children}
    </LottieContext.Provider>
  );
};

// hook for using context
export const useLottieContext = () => useContext(LottieContext);
export default LottieContextProvider;
