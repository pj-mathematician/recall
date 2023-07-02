import axios from "axios";
import {
  useState,
  useCallback,
  useContext,
  createContext,
  Dispatch,
  SetStateAction,
} from "react";

export type RecallContent = {
  transcriptionLoading: boolean;
  setTranscriptionLoading: Dispatch<SetStateAction<boolean>>;
  uploadAudioFiles: (files: FileList, language: string) => Promise<void>;
  translateText: (
    text: string,
    language: string,
    filename: string
  ) => Promise<void>;
  summarizeText: (text: string, filename: string) => Promise<void>;
  fileNames: string[];
  setFileNames: Dispatch<SetStateAction<string[]>>;
  transcriptionLanguage: string;
  setTranscriptionLanguage: Dispatch<SetStateAction<string>>;
  translation: any;
  summarization: any;
};

export const RecallContext = createContext<RecallContent>({
  transcriptionLoading: false,
  setTranscriptionLoading: () => {},
  uploadAudioFiles: async () => {},
  translateText: async () => {},
  summarizeText: async () => {},
  fileNames: [],
  setFileNames: () => {},
  transcriptionLanguage: "",
  setTranscriptionLanguage: () => {},
  translation: {},
  summarization: {},
});

export function useRecall() {
  return useContext(RecallContext);
}

type AudioProviderProps = {
  children: React.ReactNode;
};

const RecallProvider: React.FC<AudioProviderProps> = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [fileNames, setFileNames] = useState<string[]>([]);
  const [transcriptionLanguage, setTranscriptionLanguage] = useState("");
  const [translation, setTranslation] = useState<any>({});
  const [summarization, setSummarization] = useState<any>({});

  const uploadAudioFiles = useCallback(
    async (files: FileList, language: string) => {
      setLoading(true);
      const formdata = new FormData();
      for (let file of files) {
        formdata.append("files", file);
      }

      const response = await axios.post(
        `${import.meta.env.VITE_API_SERVER_URL}/audio/transcribe/multiple/`,
        formdata,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const audioTranscriptions = [...files].reduce(
        (prev: any, file, index) => ({
          ...prev,
          [file.name]: { [language]: response.data[index] },
        }),
        {}
      );
      setTranslation(audioTranscriptions);
      setLoading(false);
    },
    []
  );

  const translateText = useCallback(
    async (text: string, language: string, filename: string) => {
      if (
        Object.keys(translation).length === 0 ||
        translation?.[filename]?.[language]
      )
        return;
      setLoading(true);
      const data = JSON.parse(
        JSON.stringify({
          output_language: language,
          text,
        })
      );
      const response = await axios.post(
        `${import.meta.env.VITE_API_SERVER_URL}/text/translate/`,
        data
      );
      const audioTranslations = translation;
      audioTranslations[filename][language] = response.data;
      setTranslation(audioTranslations);
      setLoading(false);
    },
    [translation]
  );

  const summarizeText = useCallback(async (text: string, filename: string) => {
    if (summarization?.[filename]) return;
    setLoading(true);

    const formdata = new FormData();
    formdata.append("text", text);
    const response = await axios.post(
      `${import.meta.env.VITE_API_SERVER_URL}/text/summary/`,
      formdata
    );

    setSummarization({ summarization, [filename]: response.data });
    setLoading(false);
  }, []);

  return (
    <RecallContext.Provider
      value={{
        transcriptionLoading: loading,
        setTranscriptionLoading: setLoading,
        uploadAudioFiles,
        fileNames,
        setFileNames,
        transcriptionLanguage,
        setTranscriptionLanguage,
        translation,
        translateText,
        summarization,
        summarizeText,
      }}
    >
      {children}
    </RecallContext.Provider>
  );
};

export default RecallProvider;
