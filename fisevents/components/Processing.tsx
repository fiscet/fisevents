import Spinner from '../app/[lang]/creator-admin/components/Spinner';

export default function Processing({ text }: { text?: string }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      {/* <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white"></div> */}
      <div className="flex flex-col items-center">
        <Spinner />
        {text && (
          <div className="text-red-200 text-2xl md:text-4xl">{text}</div>
        )}
      </div>
    </div>
  );
}
