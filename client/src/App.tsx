import Button from "./components/Button";
import Navbar from "./components/Navbar";

function App() {
  return (
    <main className="bg-radial min-h-screen">
      <div className="container mx-auto">
        <Navbar />
        <div className="mt-8 flex flex-col items-center justify-center gap-4">
          <h1
            className="bg-gradient-to-b from-white from-10% to-[#E4E3E550] bg-clip-text
          text-6xl font-bold text-transparent"
          >
            Relive Your Conversations
          </h1>
          <p className="text-lg text-gray-400">
            Transcribe, Search, and Analyze Your Audio Recordings
          </p>
          <div className="mb-4 mt-8 h-[210px] w-[750px] rounded-lg bg-[#cccccc10] shadow">
            <div className="flex h-full w-full flex-col items-center justify-center gap-4">
              <p className="text-xl font-semibold text-gray-300">
                Drop your audio files here
              </p>
              <p className="text-sm text-gray-400">--- OR ---</p>
              <Button text="Upload" />
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div>
              <label htmlFor="transcription-language" className="text-gray-300">
                Transcription Language:
              </label>
              <select
                name="transcription-language"
                id="transcription-language"
                defaultValue=""
                className="ml-2 cursor-pointer border-b border-b-white bg-transparent
                 text-center text-gray-300 outline-none"
              >
                <option className="text-black" value="">
                  Auto
                </option>
                <option className="text-black" value="Enligsh">
                  English
                </option>
                <option className="text-black" value="Hindi">
                  Hindi
                </option>
                <option className="text-black" value="French">
                  French
                </option>
                <option className="text-black" value="German">
                  German
                </option>
              </select>
            </div>
            <Button text="Submit" />
          </div>
        </div>
      </div>
    </main>
  );
}

export default App;
