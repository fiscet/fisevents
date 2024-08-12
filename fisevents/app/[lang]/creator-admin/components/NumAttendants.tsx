import { FaPeopleLine } from 'react-icons/fa6';
import { FaCreativeCommonsZero } from 'react-icons/fa';

export default function NumAttendants({ num }: { num?: number }) {
  if (num) {
    return (
      <div className="flex flex-col items-center text-sky-700">
        <FaPeopleLine className="w-5 h-5" />
        <span>{num}</span>
      </div>
    );
  }

  return <FaCreativeCommonsZero className="w-5 h-5 text-red-400" />;
}
