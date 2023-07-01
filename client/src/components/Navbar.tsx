import Button from "./Button";

const Navbar = () => {
  return (
    <div className="flex items-center justify-between px-16 py-8 text-lg font-semibold text-white">
      <h2 className="cursor-pointer text-xl">Recall</h2>
      <div className="flex items-center gap-4">
        <span className="cursor-pointer">Login</span>
        <Button text="Get Started" />
      </div>
    </div>
  );
};

export default Navbar;
