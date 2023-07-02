import { useEffect, useRef } from "react";
import { FiSend } from "react-icons/fi";
import { useRecall } from "../contexts/RecallProvider";

const MAX_TEXTAREA_HEIGHT = 100;

const Chat = () => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { askQuestion, chatLoading, loading, chatMessages, setChatMessages } =
    useRecall();

  function resetTextareaHeight() {
    const textarea = textareaRef.current!;
    textarea.style.height = "auto";
    textarea.style.height =
      Math.min(textarea.scrollHeight, MAX_TEXTAREA_HEIGHT) + "px";
    const maxHeightReached = textarea.scrollHeight >= MAX_TEXTAREA_HEIGHT;
    textarea.classList.toggle("overflow-y-hidden", !maxHeightReached);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (userCannotSendMessage()) return false;
      addUserMessage();
      resetTextareaHeight();
    }
  }

  useEffect(() => {
    if (chatMessages.length === 0) return;
    document
      .querySelectorAll(".message")
      ?.item(chatMessages.length - 1)
      ?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  function userCannotSendMessage() {
    return (
      chatMessages.length % 2 !== 0 ||
      textareaRef.current!.value === "" ||
      chatLoading ||
      loading
    );
  }

  function handleClick() {
    if (userCannotSendMessage()) return;
    addUserMessage();
  }

  function addUserMessage() {
    const message = textareaRef.current!.value;
    setChatMessages((prev) => [...prev, message]);
    textareaRef.current!.value = "";
    askQuestion(message);
  }

  return (
    <div className="relative mr-8 flex h-full w-5/12 shrink-0 flex-col gap-4 rounded-lg bg-[#cccccc10] p-4 shadow">
      <h3 className="text-center text-lg font-semibold text-gray-300">Chat</h3>
      <div className="grow">
        <div className="h-[405px] overflow-auto whitespace-pre-wrap">
          {chatMessages.length !== 0 && (
            <div className="mb-16">
              {chatMessages.map((message, index) => (
                <div
                  key={index}
                  className={
                    "message flex items-start gap-4 bg-gray-100 px-4 py-4 " +
                    (index % 2 === 0 ? "bg-opacity-50" : "bg-opacity-70")
                  }
                >
                  <p>{index % 2 === 0 ? "🧑" : "🧠"}</p>
                  <p className="whitespace-pre-wrap">{message}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="absolute bottom-0 left-0 mb-4 w-full px-4">
        <div
          className="relative flex w-full rounded-md bg-white py-2 shadow-lg md:py-3
          md:pl-4"
        >
          <textarea
            ref={textareaRef}
            name="user-message"
            rows={1}
            className="max-h-[200px] w-full resize-none overflow-y-hidden border-0 pl-2 pr-7 outline-none md:pl-0"
            placeholder="Ask Something..."
            onInput={resetTextareaHeight}
            onKeyDown={handleKeyDown}
          ></textarea>
          <button
            type="submit"
            className="absolute bottom-1.5 right-1 p-1 text-lg text-[#91ADF6] md:bottom-2.5 md:right-2"
            onClick={handleClick}
          >
            <FiSend />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
