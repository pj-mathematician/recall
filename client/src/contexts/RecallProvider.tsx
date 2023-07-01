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
  uploadAudioFiles: (files: FileList, language: String) => Promise<void>;
};

export const RecallContext = createContext<RecallContent>({
  transcriptionLoading: false,
  setTranscriptionLoading: () => {},
  uploadAudioFiles: async () => {},
});

export function useAudio() {
  return useContext(RecallContext);
}

type AudioProviderProps = {
  children: React.ReactNode;
};

const RecallProvider: React.FC<AudioProviderProps> = ({ children }) => {
  const [transcriptionLoading, setTranscriptionLoading] = useState(false);

  const uploadAudioFiles = useCallback(
    async (files: FileList, language: String) => {
      setTranscriptionLoading(true);
      console.log({ files, language });
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
      }}
    >
      {children}
    </RecallContext.Provider>
  );
};

export default RecallProvider;
