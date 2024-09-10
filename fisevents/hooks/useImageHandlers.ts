import { FileImageType } from "@/types/custom.types";
import { useState } from "react";

export const useImageHandlers = (initialImageUrl: string | undefined) => {
  const [initImageUrl, setInitImageUrl] = useState(initialImageUrl);
  const [newImg, setNewImg] = useState<FileImageType>({
    file: {} as File,
    imgUrl: initialImageUrl ?? ''
  });

  const handleRestoreImage = () => {
    setNewImg({
      file: {} as File,
      imgUrl: initImageUrl ?? ''
    });
  };

  const handleDeleteImage = () => {
    setNewImg({
      file: {} as File,
      imgUrl: ''
    });
  };

  return {
    initImageUrl,
    newImg,
    setNewImg,
    handleRestoreImage,
    handleDeleteImage,
    setInitImageUrl
  };
};