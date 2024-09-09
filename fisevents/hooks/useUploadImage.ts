'use client';

import { FileImageType } from "@/types/custom.types";

export const useUploadImage = (newImg: FileImageType) => {

  return async () => {
    const formData = new FormData();
    formData.append('file', newImg.file);

    const response = await fetch('/api/uploadImage', {
      method: 'POST',
      body: formData
    });

    return (await response.json()) as {
      status: string;
      id?: string;
      url?: string;
      error?: any;
    };
  };
};