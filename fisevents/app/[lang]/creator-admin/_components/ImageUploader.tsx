'use client';

import { ChangeEvent, memo } from 'react';
import Image from 'next/image';
import { GrCloudUpload } from 'react-icons/gr';
import { GrRevert } from 'react-icons/gr';
import { GrTrash } from 'react-icons/gr';
import { FileImageType } from '@/types/custom.types';
import { FormLabel } from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { RiInformation2Fill } from 'react-icons/ri';

export type ImageUploaderProps = {
  label?: string;
  description?: string;
  boxSize?: number;
  initImageUrl?: string;
  img?: FileImageType;
  setImg: (img: FileImageType) => void;
  onRestore: () => void;
  onDelete: () => void;
};

const ImageUploader = memo(
  function ImageUploader({
    label,
    description,
    boxSize = 320,
    initImageUrl,
    img,
    setImg,
    onRestore,
    onDelete
  }: ImageUploaderProps) {
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
      }
    };

    return (
      <div>
        <div className="flex align-middle justify-between">
          <FormLabel className="text-gray-600 italic">{label}</FormLabel>
          {description && (
            <Popover>
              <PopoverTrigger>
                <RiInformation2Fill className="w-5 h-5 text-gray-600" />
              </PopoverTrigger>
              <PopoverContent className="w-80 bg-white shadow-lg">
                <div className="p-4">
                  <p className="text-gray-600 mt-2">{description}</p>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>

        <div
          style={{
            maxWidth: boxSize,
            maxHeight: boxSize,
            width: boxSize,
            height: boxSize
          }}
          className={`relative mx-auto bg-slate-50 border overflow-hidden`}
        >
          {img?.imgUrl && (
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
                  key={img?.imgUrl}
                  type="file"
                  name="upload"
                  onChange={(e) => handleFilePicker(e)}
                  accept="image/*"
                  id="file_uploader"
                />
              </label>
              {initImageUrl != img?.imgUrl && (
                <div className="cursor-pointer" onClick={onRestore}>
                  <GrRevert className="w-5 h-5 text-cyan-700" />
                </div>
              )}
              <div className="cursor-pointer" onClick={onDelete}>
                <GrTrash className="w-5 h-5 text-red-700" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
  (prevProps, nextProps) => {
    if (prevProps.img?.imgUrl === nextProps.img?.imgUrl) {
      return true;
    }
    return false;
  }
);

export default ImageUploader;
