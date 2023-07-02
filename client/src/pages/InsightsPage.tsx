import Chat from "../components/Chat";
import Insights from "../components/Insights";
import { useRecall } from "../contexts/RecallProvider";

const InsightsPage = () => {
  //   const { fileNames, transcriptionLanguage } = useAudio();

  return (
    <main className="min-h-screen overflow-hidden">
      <div className="container mx-auto h-screen px-8 py-8">
        <div className="flex h-full justify-between">
          <Chat />
          <Insights />
        </div>
        {/* {fileNames.map((filename) => (
          <div className="text-white" key={filename}>
            {filename}
          </div>
        ))}
        {transcriptionLanguage} */}
      </div>
    </main>
  );
};

export default InsightsPage;
