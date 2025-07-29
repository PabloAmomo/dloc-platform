const resizeImageFile = async (fileData: string, maxDimension: number, onReady: (imageUrl: string) => void) => {
  const img = new Image();
  img.onload = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = img.width;
    let height = img.height;

    if (width > height) {
      if (width > maxDimension) {
        height *= maxDimension / width;
        width = maxDimension;
      }
    } else {
      if (height > maxDimension) {
        width *= maxDimension / height;
        height = maxDimension;
      }
    }

    canvas.width = width;
    canvas.height = height;

    ctx.drawImage(img, 0, 0, width, height);
    const resizedImageUrl: string = canvas.toDataURL('image/png');

    onReady(resizedImageUrl);
  };
  img.src = fileData;
};

export default resizeImageFile;