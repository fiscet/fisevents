/** IMAGES */
export const IMAGE_SIZES = ['sm', 'md', 'lg', 'orig'] as const;
export const IMAGE_ALIGNMENTS = ['left', 'center', 'right'] as const;
export const IMAGE_ALIGN_LEFT_CLASS = 'float-left';
export const IMAGE_ALIGN_CENTER_CLASS = 'mx-auto';
export const IMAGE_ALIGN_RIGHT_CLASS = 'float-right';
export const IMAGE_MAX_W_SM_CLASS = 'max-w-40';
export const IMAGE_MAX_W_MD_CLASS = 'max-w-md';
export const IMAGE_MAX_W_LG_CLASS = 'max-w-xl';
export const IMAGE_MAX_W_ORIG_CLASS = 'max-w-100';

export const classAlignments = new Map<(typeof IMAGE_ALIGNMENTS)[number], string>();
classAlignments.set('left', IMAGE_ALIGN_LEFT_CLASS);
classAlignments.set('center', IMAGE_ALIGN_CENTER_CLASS);
classAlignments.set('right', IMAGE_ALIGN_RIGHT_CLASS);

export const classSizes = new Map<(typeof IMAGE_SIZES)[number], string>();
classSizes.set('sm', IMAGE_MAX_W_SM_CLASS);
classSizes.set('md', IMAGE_MAX_W_MD_CLASS);
classSizes.set('lg', IMAGE_MAX_W_LG_CLASS);
classSizes.set('orig', IMAGE_MAX_W_ORIG_CLASS);
