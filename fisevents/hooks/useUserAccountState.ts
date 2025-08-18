import { useState, useEffect } from 'react';
import { FileImageType } from '@/types/custom.types';
import { CurrentUser } from '@/types/sanity.extended.types';

export const useUserAccountState = (userData: CurrentUser) => {
  const [initImageUrl, setInitImageUrl] = useState(userData.logoUrl);
  const [newImg, setNewImg] = useState<FileImageType>({
    file: {} as File,
    imgUrl: userData.logoUrl ?? ''
  });
  const [isVeryFirstAccess, setIsVeryFirstAccess] = useState(false);

  useEffect(() => {
    if (!userData.name || !userData.companyName) {
      setIsVeryFirstAccess(true);
    }
  }, [userData.name, userData.companyName]);

  const handleRestoreImage = () => {
    setNewImg({ file: {} as File, imgUrl: initImageUrl ?? '' });
  };

  const handleDeleteImage = () => {
    setNewImg({ file: {} as File, imgUrl: '' });
  };

  return {
    initImageUrl,
    setInitImageUrl,
    newImg,
    setNewImg,
    isVeryFirstAccess,
    handleRestoreImage,
    handleDeleteImage
  };
};
