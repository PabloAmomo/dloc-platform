const getDataUrlFromImageUrl = (imageUrl: string, callback: (dataUrl: string | null) => void) => {
  fetch(imageUrl)
    .then((response) => response.blob())
    .then((blob) => {
      const reader = new FileReader();
      reader.onloadend = function () {
        callback(reader.result as string | null);
      };
      reader.readAsDataURL(blob);
    })
    .catch((error) => console.error('Error:', error));
};

export default getDataUrlFromImageUrl;