type TranslationProps = {
  text: string;
};

const Translation: React.FC<TranslationProps> = ({ text }) => {
  return <div className="h-full overflow-auto">{text}</div>;
};

export default Translation;
