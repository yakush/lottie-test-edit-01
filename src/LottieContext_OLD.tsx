import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { LottieJson } from "./types/LottieJson";
import { LottieEditsConfig } from "./types/LottieEditsConfig";

export interface ILottieContext {
  url: string;
  json?: LottieJson;
  editsJson?: LottieEditsConfig;
  isLoading: boolean;
  error?: unknown;

  setJson: React.Dispatch<React.SetStateAction<LottieJson | undefined>>;
  setEditsJson: React.Dispatch<
    React.SetStateAction<LottieEditsConfig | undefined>
  >;

  loadUrl: (url: string, editsUrl?: string) => Promise<LottieJson>;
  loadFile: (file: File, editsFile?: File) => Promise<LottieJson>;
}
const initialState: ILottieContext = {
  url: "",
  json: undefined,
  editsJson: undefined,
  isLoading: false,
  error: undefined,
  loadUrl: () => Promise.reject<LottieJson>(),
  loadFile: () => Promise.reject<LottieJson>(),
  setJson: () => {},
  setEditsJson: () => {},
};

const LottieContext = React.createContext<ILottieContext>(initialState);

const LottieContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<unknown>();
  const [json, setJson] = useState<LottieJson>();
  const [editsJson, setEditsJson] = useState<LottieEditsConfig>();

  useEffect(() => {
    console.log({json});
  }, [json]);

  useEffect(() => {
    console.log({editsJson});
  }, [editsJson]);

  const loadUrl = useCallback(async (url: string, urlEdits?: string) => {
    try {
      setUrl(url);
      setIsLoading(true);
      setError(undefined);
      setJson(undefined);
      setEditsJson(undefined);

      const resJson = await fetch(url);
      const jsonJson = await resJson.json();

      let jsonEdits = undefined;
      if (urlEdits) {
        const resEdits = await fetch(urlEdits);
        jsonEdits = await resEdits.json();
      }

      setJson(jsonJson);
      setEditsJson(jsonEdits);

      setIsLoading(false);
      setError(undefined);
      return jsonJson;
    } catch (e) {
      setUrl(url);
      setIsLoading(false);
      setError(e);
      throw e;
    }
  }, []);

  const loadFile = useCallback((file: File, fileEdits?: File) => {
    return new Promise<LottieJson>((resolve, reject) => {
      setUrl("");
      setIsLoading(true);
      setError(undefined);
      setJson(undefined);
      setEditsJson(undefined);

      const reader = new FileReader();

      reader.onabort = () => {
        console.log("file reading was aborted");
        setIsLoading(false);
        setError("file reading was aborted");
        setJson(undefined);
        reject("file reading was aborted");
      };

      reader.onerror = () => {
        console.log("file reading has failed");
        setIsLoading(false);
        setError("file reading has failed");
        setJson(undefined);
        reject("file reading has failed");
      };

      reader.onload = () => {
        try {
          const str = reader.result as string;
          const json = JSON.parse(str);
          setJson(json);
          setIsLoading(false);
          setError(undefined);

          console.log(json);
          resolve(json);
        } catch (err) {
          console.log("JSON parsing failed");
          setIsLoading(false);
          setError("JSON parsing failedF");
          setJson(undefined);
          reject("JSON parsing failedF");
        }
      };
      reader.readAsText(file);
    });
  }, []);

  return (
    <LottieContext.Provider
      value={{
        url,
        isLoading,
        error,
        json,
        setJson,
        editsJson,
        setEditsJson,
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
