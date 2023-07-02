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
  fileNames: string[];
  setFileNames: Dispatch<SetStateAction<string[]>>;
  transcriptionLanguage: string;
  setTranscriptionLanguage: Dispatch<SetStateAction<string>>;
  transcription: any;
};

export const RecallContext = createContext<RecallContent>({
  transcriptionLoading: false,
  setTranscriptionLoading: () => {},
  uploadAudioFiles: async () => {},
  fileNames: [],
  setFileNames: () => {},
  transcriptionLanguage: "",
  setTranscriptionLanguage: () => {},
  transcription: {},
});

export function useRecall() {
  return useContext(RecallContext);
}

type AudioProviderProps = {
  children: React.ReactNode;
};

const RecallProvider: React.FC<AudioProviderProps> = ({ children }) => {
  const [transcriptionLoading, setTranscriptionLoading] = useState(false);
  const [fileNames, setFileNames] = useState<string[]>([]);
  const [transcriptionLanguage, setTranscriptionLanguage] = useState("");
  const [transcription, setTranscription] = useState<any>({});

  const uploadAudioFiles = useCallback(
    async (files: FileList, language: string) => {
      if (transcription[language]) return;
      setTranscriptionLoading(true);
      console.log({ files, language });
      const audioTranscriptions = [...files].reduce(
        (prev: any, file) => ({
          ...prev,
          [file.name]: { [language]: "abcjsbd" },
        }),
        {}
      );
      console.log(audioTranscriptions);
      setTranscription(audioTranscriptions);
      // setTranscription({ ...transcription, [language]: "acbdjkjsdfsk" });
      //   const formdata = new FormData();
      // formdata.append("file", files[0]);

      // const response = await axios.post(
      //   `${import.meta.env.VITE_API_SERVER_URL}/audio/transcribe/file`,
      //   formdata,
      //   {
      //     headers: {
      //       "Content-Type": "multipart/form-data",
      //     },
      //   }
      // );
      // console.log(response);
      setTranscriptionLoading(false);
    },
    []
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
        transcription,
      }}
    >
      {children}
    </RecallContext.Provider>
  );
};

export default RecallProvider;
