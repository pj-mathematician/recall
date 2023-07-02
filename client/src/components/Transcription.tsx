type TranscriptionProps = {
  text: string;
};

const Transcription: React.FC<TranscriptionProps> = ({ text }) => {
  return <div className="h-[405px] overflow-auto whitespace-pre">{text}</div>;
};

export default Transcription;
