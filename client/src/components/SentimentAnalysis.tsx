type SentimentAnalysisProps = {
  sentiment: any;
};

const SentimentAnalysis: React.FC<SentimentAnalysisProps> = ({ sentiment }) => {
  return (
    <div className="h-[405px] overflow-auto whitespace-pre-wrap">
      <div className="flex h-full w-full items-center justify-center">
        <div className="flex items-end gap-4">
          <div className="flex flex-col items-center gap-2">
            <div className="text-gray-300">{sentiment["positive"] * 100}%</div>
            <div
              className="bg-[#831fee]"
              style={{
                height: `calc(${sentiment["positive"]} * 350px)`,
                width: "50px",
              }}
            ></div>
            <div className="text-lg text-gray-300">Positive</div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="text-gray-300">{sentiment["neutral"] * 100}%</div>
            <div
              className="bg-white"
              style={{
                height: `calc(${sentiment["neutral"]} * 350px)`,
                width: "50px",
              }}
            ></div>
            <div className="text-lg text-gray-300">Neutral</div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="text-gray-300">{sentiment["negative"] * 100}%</div>
            <div
              className="bg-[#7109E0]"
              style={{
                height: `calc(${sentiment["negative"]} * 350px)`,
                width: "50px",
              }}
            ></div>
            <div className="text-lg text-gray-300">Negative</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SentimentAnalysis;
