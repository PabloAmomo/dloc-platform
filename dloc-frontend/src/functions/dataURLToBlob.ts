const dataURLToBlob = (dataURL: string) : Blob => {
  // Separar la URL en las partes base64 y el contenido
  const parts = dataURL.split(',');
  const base64Data = parts[1];

  // Decodificar la cadena base64
  const binaryString = atob(base64Data);

  // Crear un array de bytes
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  // Crear un Blob a partir del array de bytes
  return new Blob([bytes], { type: 'image/png' });
}

export default dataURLToBlob;