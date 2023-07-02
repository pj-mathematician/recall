import Chat from "../components/Chat";
import Insights from "../components/Insights";

const InsightsPage = () => {
  return (
    <main className="min-h-screen overflow-hidden">
      <div className="container mx-auto h-screen px-8 py-8">
        <div className="flex h-full justify-between">
          <Chat />
          <Insights />
        </div>
      </div>
    </main>
  );
};

export default InsightsPage;
