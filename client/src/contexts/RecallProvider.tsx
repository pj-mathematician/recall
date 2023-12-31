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
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
  uploadAudioFiles: (files: FileList, language: string) => Promise<void>;
  translateText: (
    text: string,
    language: string,
    filename: string
  ) => Promise<void>;
  summarizeText: (text: string, filename: string) => Promise<void>;
  getTextSentiment: (text: string, filename: string) => Promise<void>;
  fileNames: string[];
  setFileNames: Dispatch<SetStateAction<string[]>>;
  transcriptionLanguage: string;
  setTranscriptionLanguage: Dispatch<SetStateAction<string>>;
  translation: any;
  summarization: any;
  sentiment: any;
  chatLoading: boolean;
  chatMessages: string[];
  setChatMessages: Dispatch<SetStateAction<string[]>>;
  askQuestion: (query: string) => Promise<void>;
};

export const RecallContext = createContext<RecallContent>({
  loading: false,
  setLoading: () => {},
  uploadAudioFiles: async () => {},
  translateText: async () => {},
  summarizeText: async () => {},
  getTextSentiment: async () => {},
  fileNames: [],
  setFileNames: () => {},
  transcriptionLanguage: "",
  setTranscriptionLanguage: () => {},
  translation: {},
  summarization: {},
  sentiment: {},
  chatLoading: false,
  chatMessages: [],
  setChatMessages: () => {},
  askQuestion: async () => {},
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
  const [sentiment, setSentiment] = useState<any>({});
  const [chatLoading, setChatLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState<string[]>([]);

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

    text = text.replace(
      /(\d+\n\d{2}:\d{2}:\d{2},\d{3} --> \d{2}:\d{2}:\d{2},\d{3})\n/g,
      ""
    );
    text = text.replace(/\n/g, "\\n");

    const formdata = new FormData();
    formdata.append("text", text);
    const response = await axios.post(
      `${import.meta.env.VITE_API_SERVER_URL}/text/summary/`,
      formdata
    );

    setSummarization({ ...summarization, [filename]: response.data });
    setLoading(false);
  }, []);

  const getTextSentiment = useCallback(
    async (text: string, filename: string) => {
      if (sentiment?.[filename]) return;
      setLoading(true);

      text = text.replace(
        /(\d+\n\d{2}:\d{2}:\d{2},\d{3} --> \d{2}:\d{2}:\d{2},\d{3})\n/g,
        ""
      );
      text = text.replace(/\n/g, "\\n");

      const formdata = new FormData();
      formdata.append("text", text);
      const response = await axios.post(
        `${import.meta.env.VITE_API_SERVER_URL}/text/sentiment/`,
        formdata
      );

      setSentiment({ ...sentiment, [filename]: response.data });
      setLoading(false);
    },
    []
  );

  const askQuestion = useCallback(
    async (query: string) => {
      setChatLoading(true);

      const formdata = new FormData();
      let text = "";
      for (let filename of fileNames) {
        text += `Audio Name: ${filename}\nAudio Transcript: ${translation[filename][transcriptionLanguage]}\n\n`;
      }

      formdata.append("text", text);
      formdata.append("query", query);
      const response = await axios.post(
        `${import.meta.env.VITE_API_SERVER_URL}/text/qna/`,
        formdata
      );

      setChatMessages((prev) => [...prev, response.data]);
      setChatLoading(false);
    },
    [translation]
  );

  return (
    <RecallContext.Provider
      value={{
        loading,
        setLoading,
        uploadAudioFiles,
        fileNames,
        setFileNames,
        transcriptionLanguage,
        setTranscriptionLanguage,
        translation,
        translateText,
        summarization,
        summarizeText,
        getTextSentiment,
        sentiment,
        chatLoading,
        chatMessages,
        setChatMessages,
        askQuestion,
      }}
    >
      {children}
    </RecallContext.Provider>
  );
};

export default RecallProvider;
