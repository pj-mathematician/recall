import { useState } from "react";
import Button from "../components/Button";
import Navbar from "../components/Navbar";
import { useAudio } from "../contexts/RecallProvider";
import { useNavigate } from "react-router-dom";

function LandingPage() {
  const [fileNames, setFileNames] = useState<string[]>([]);
  const { uploadAudioFiles } = useAudio();
  const navigate = useNavigate();

  function handleDragOver(e: React.DragEvent<HTMLFormElement>) {
    e.preventDefault();
    const target = e.target as HTMLFormElement;
    target.classList.add("hover");
  }

  function handleDragLeave(e: React.DragEvent<HTMLFormElement>) {
    const target = e.target as HTMLFormElement;
    target.classList.remove("hover");
  }

  function handleFileDrop(e: React.DragEvent<HTMLFormElement>) {
    e.preventDefault();
    const files = e.dataTransfer.files;
    const fileInput = document.getElementById(
      "file-input"
    )! as HTMLInputElement;
    fileInput.files = files; // add files to the input
    handleFileChange();
    const target = e.target as HTMLFormElement;
    target.classList.remove("hover");
  }

  function handleFileChange() {
    const fileInput = document.getElementById(
      "file-input"
    )! as HTMLInputElement;
    if (!fileInput.files) return;
    const names: string[] = [];
    [...fileInput.files].map((file) => names.push(file.name));
    setFileNames(names);
  }

  function openFileExplorer() {
    const fileInput = document.getElementById(
      "file-input"
    )! as HTMLInputElement;
    fileInput.click();
  }

  async function handleAudioUpload() {
    const fileInput = document.getElementById(
      "file-input"
    )! as HTMLInputElement;
    const files = fileInput.files;
    if (files === null || files?.length === 0) return;

    const languageInput = document.getElementById(
      "transcription-language"
    )! as HTMLInputElement;
    const language = languageInput.value;
    navigate("/insights");
    uploadAudioFiles(files, language);
  }

  return (
    <main className="min-h-screen">
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
            <form
              className="flex h-full w-full flex-col items-center justify-center gap-4 px-8"
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleFileDrop}
            >
              <input
                type="file"
                id="file-input"
                name="file"
                className="hidden"
                multiple={true}
                accept="audio/mp3,audio/*;capture=microphone"
                onChange={handleFileChange}
              />
              <p className="text-xl font-semibold text-gray-300">
                Drop your audio files here
              </p>
              <p className="text-sm text-gray-400">--- OR ---</p>
              <Button text="Upload" type="button" onClick={openFileExplorer} />
              <div className="flex items-center gap-2">
                {fileNames.map((filename) => (
                  <span key={filename} className="text-gray-300">
                    {filename}
                  </span>
                ))}
              </div>
            </form>
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
            <Button text="Submit" onClick={handleAudioUpload} />
          </div>
        </div>
      </div>
    </main>
  );
}

export default LandingPage;
