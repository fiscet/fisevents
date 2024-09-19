'use client';

export type EventNotFoundProps = {
  message: string;
};

export default function EventNotFound({ message }: EventNotFoundProps) {
  return (
    <h1 className="bg-red-500 text-white text-2xl font-bold text-center my-5 py-5">
      {message}
    </h1>
  );
}
