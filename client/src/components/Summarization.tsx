type SummarizationProps = {
  text: string;
};

const Summarization: React.FC<SummarizationProps> = ({ text }) => {
  return (
    <div className="h-[405px] overflow-auto whitespace-pre-wrap">{text}</div>
  );
};

export default Summarization;
