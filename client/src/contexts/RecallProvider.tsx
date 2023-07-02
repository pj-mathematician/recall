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
  fileNames: string[];
  setFileNames: Dispatch<SetStateAction<string[]>>;
  transcriptionLanguage: string;
  setTranscriptionLanguage: Dispatch<SetStateAction<string>>;
  translation: any;
};

export const RecallContext = createContext<RecallContent>({
  transcriptionLoading: false,
  setTranscriptionLoading: () => {},
  uploadAudioFiles: async () => {},
  translateText: async () => {},
  fileNames: [],
  setFileNames: () => {},
  transcriptionLanguage: "",
  setTranscriptionLanguage: () => {},
  translation: {},
});

export function useRecall() {
  return useContext(RecallContext);
}

type AudioProviderProps = {
  children: React.ReactNode;
};

function jsonEscape(str: string) {
  return str
    .replace(/\n/g, "\\\\n")
    .replace(/\r/g, "\\\\r")
    .replace(/\t/g, "\\\\t");
}

const RecallProvider: React.FC<AudioProviderProps> = ({ children }) => {
  const [transcriptionLoading, setTranscriptionLoading] = useState(false);
  const [fileNames, setFileNames] = useState<string[]>([]);
  const [transcriptionLanguage, setTranscriptionLanguage] = useState("");
  const [translation, setTranslation] = useState<any>({});

  const uploadAudioFiles = useCallback(
    async (files: FileList, language: string) => {
      setTranscriptionLoading(true);
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
      setTranscriptionLoading(false);
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
      setTranscriptionLoading(true);
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
      debugger;
      const audioTranscriptions = translation;
      audioTranscriptions[filename][language] = response.data;
      setTranslation(audioTranscriptions);
      setTranscriptionLoading(false);
    },
    [translation]
  );

  return (
    <RecallContext.Provider
      value={{
        transcriptionLoading,
        setTranscriptionLoading,
        uploadAudioFiles,
        fileNames,
        setFileNames,
        transcriptionLanguage,
        setTranscriptionLanguage,
        translation,
        translateText,
      }}
    >
      {children}
    </RecallContext.Provider>
  );
};

export default RecallProvider;
