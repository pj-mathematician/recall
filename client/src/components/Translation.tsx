type TranslationProps = {
  text: string;
};

const Translation: React.FC<TranslationProps> = ({ text }) => {
  return <div className="h-[405px] overflow-auto whitespace-pre">{text}</div>;
};

export default Translation;
