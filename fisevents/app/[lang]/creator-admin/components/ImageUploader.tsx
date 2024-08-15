'use client';

import { FileImageType } from '@/types/custom.types';
import Image from 'next/image';
import { ChangeEvent, useState } from 'react';
import { GrCloudUpload } from 'react-icons/gr';
import { GrRevert } from 'react-icons/gr';
import { GrTrash } from 'react-icons/gr';

export type ImageUploaderProps = {
  boxSize?: number;
  initImageUrl?: string;
  onFileChanged: ({ file, imgUrl }: FileImageType) => any;
};

export default function ImageUploader({
  boxSize = 320,
  initImageUrl,
  onFileChanged
}: ImageUploaderProps) {
  const [img, setImg] = useState<FileImageType>({
    file: {} as File,
    imgUrl: initImageUrl ?? ''
  });

  const handleFilePicker = async (
    e: ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    const { files } = e.target;

    if (files != null && files.length > 0) {
      const imageObject = {
        file: files[0],
        imgUrl: URL.createObjectURL(files[0])
      };
      setImg(imageObject);
      onFileChanged(imageObject);
    }
  };

  const handleRestoreImage = (): void => {
    if (initImageUrl) {
      const imageObject = { file: {} as File, imgUrl: initImageUrl };
      setImg(imageObject);
      onFileChanged(imageObject);
    }
  };

  const handleDeleteImage = (): void => {
    const imageObject = { file: {} as File, imgUrl: '' };
    setImg(imageObject);
    onFileChanged(imageObject);
  };

  return (
    <div
      style={{
        maxWidth: boxSize,
        maxHeight: boxSize,
        width: boxSize,
        height: boxSize
      }}
      className={`relative mx-auto bg-slate-50 border`}
    >
      {img.imgUrl && (
        <Image
          src={img.imgUrl}
          width={boxSize}
          height={boxSize}
          className="mx-auto"
          alt=""
          loading="lazy"
        />
      )}
      <div className="w-full h-16 absolute top inset-x-0 bottom-0">
        <div className="bg-white opacity-60 w-full h-16 absolute top inset-x-0 bottom-0 z-10"></div>
        <div className="w-full h-16 absolute px-7 flex justify-between items-center z-20 md:opacity-50 md:hover:opacity-100">
          <label id="file_uploader" className="w-5 h-5 cursor-pointer">
            <GrCloudUpload className="w-5 h-5" />
            <input
              className="w-0 h-0 opacity-0"
              key={img.imgUrl}
              type="file"
              name="upload"
              onChange={(e) => handleFilePicker(e)}
              accept="image/*"
              id="file_uploader"
            />
          </label>
          {initImageUrl && initImageUrl !== img.imgUrl && (
            <div
              className="cursor-pointer"
              onClick={() => handleRestoreImage()}
            >
              <GrRevert className="w-5 h-5 text-sky-700" />
            </div>
          )}
          <div className="cursor-pointer" onClick={() => handleDeleteImage()}>
            <GrTrash className="w-5 h-5 text-red-700" />
          </div>
        </div>
      </div>
    </div>
  );
}
