type ButtonProps = {
  text: String;
};

const Button: React.FC<ButtonProps> = ({ text }) => {
  return (
    <button
      className="cursor-pointer rounded bg-[#7109E0] px-4 py-1 
    font-semibold text-white duration-75 hover:bg-[#831fee]"
    >
      {text}
    </button>
  );
};

export default Button;
