import 'styles/polaroidCarrusel.style.css'

const PolaroidCarrusel = (props: PolaroidCarruselProps) => {
  const { images } = props;

  return (
    <div className="polaroid-carrusel-container">
      <div className="polaroid-carrusel-gallery">
        {images.map((image: PolaroidCarruselImage) => (
          <img key={image.src} src={image.src} alt={image.alt} />
        ))}
      </div>
    </div>
  );
};

export default PolaroidCarrusel;

interface PolaroidCarruselProps {
  images: PolaroidCarruselImage[];
}

export interface PolaroidCarruselImage {
  alt: string;
  src: string;
  title: string;
}
