import { FaPeopleLine } from 'react-icons/fa6';
import { BiMinus } from "react-icons/bi";

export default function NumAttendants({ num }: { num?: number }) {
  if (num) {
    return (
      <div className="flex sm:flex-col gap-1 sm:gap-0 items-center text-cyan-700">
        <FaPeopleLine className="w-5 h-5" />
        <span>{num}</span>
      </div>
    );
  }

  return <BiMinus className="w-5 h-5 text-gray-600" />;
}
