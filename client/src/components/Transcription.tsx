type TranscriptionProps = {
  text: string;
};

const Transcription: React.FC<TranscriptionProps> = ({ text }) => {
  return <div className="h-full overflow-auto">{text}</div>;
};

export default Transcription;
