import React, { useCallback, useContext, useMemo, useState } from "react";
import { LottieJson } from "./types/LottieJson";

export interface ILottieContext {
  url: string;
  json?: LottieJson;
  isLoading: boolean;
  error?: unknown;

  setJson: React.Dispatch<React.SetStateAction<LottieJson>>;
  loadUrl: (url: string) => Promise<LottieJson>;
}
const initialState: ILottieContext = {
  url: "",
  json: undefined,
  isLoading: false,
  error: undefined,
  loadUrl: () => Promise.reject<LottieJson>(),
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

  return (
    <LottieContext.Provider
      value={{
        url,
        isLoading,
        error,
        json,
        setJson,
        loadUrl,
      }}
    >
      {children}
    </LottieContext.Provider>
  );
};

// hook for using context
export const useLottieContext = () => useContext(LottieContext);
export default LottieContextProvider;
