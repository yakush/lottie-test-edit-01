import React, { useCallback, useContext, useMemo, useState } from "react";
import { LottieJson } from "./types/LottieJson";

export interface ILottieContext {
  url: string;
  json?: LottieJson;
  isLoading: boolean;
  error?: unknown;

  setJson: React.Dispatch<React.SetStateAction<LottieJson>>;
  loadUrl: (url: string) => Promise<LottieJson>;
  loadFile: (file: File) => Promise<LottieJson>;
}
const initialState: ILottieContext = {
  url: "",
  json: undefined,
  isLoading: false,
  error: undefined,
  loadUrl: () => Promise.reject<LottieJson>(),
  loadFile: () => Promise.reject<LottieJson>(),
  setJson: () => {},
};

const LottieContext = React.createContext<ILottieContext>(initialState);

const LottieContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<unknown>();
  const [json, setJson] = useState<LottieJson>();

  const loadUrl = useCallback(async (url: string) => {
    try {
      setUrl(url);
      setIsLoading(true);
      setError(undefined);
      setJson(undefined);

      const res = await fetch(url);
      const json = await res.json();
      setJson(json);

      setIsLoading(false);
      setError(undefined);
      return json;
    } catch (e) {
      setUrl(url);
      setIsLoading(false);
      setError(e);
      throw e;
    }
  }, []);

  const loadFile = useCallback((file: File) => {
    return new Promise<LottieJson>((resolve, reject) => {
      setUrl("");
      setIsLoading(true);
      setError(undefined);
      setJson(undefined);

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
