import { PolaroidCarruselImage } from "components/PolaroidCarrusel/PolaroidCarrusel";

const IMAGE_LIST: PolaroidCarruselImage[] = [1, 2, 3, 4, 5, 6, 7, 8].map((i) => ({
  src: `images/carrusel/image-${i < 10 ? '0' + i : i}.webp`,
  alt: `pet-photo-${i}`,
  title: '',
}));

export default IMAGE_LIST; 
