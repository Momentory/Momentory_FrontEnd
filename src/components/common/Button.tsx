type ButtonProps = {
  text: string;
  onClick?: () => void;
  disabled?: boolean;
};

export default function Button({ text, onClick, disabled }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full py-3 rounded-lg font-semibold transition 
        ${disabled ? "bg-gray-300 cursor-not-allowed" : "bg-pink-400 hover:bg-pink-500 text-white"}`}
    >
      {text}
    </button>
  );
}
