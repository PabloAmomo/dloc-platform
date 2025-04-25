import GeoMapV2 from 'components/GeoMap/GeoMap';
import PageContainer from 'components/PageContainer/PageContainer';
import { MapProvider } from 'providers/MapProvider';

const Map = () => {
  return (
    <PageContainer>
      <MapProvider>
        <GeoMapV2 />
      </MapProvider>
    </PageContainer>
  );
}

export { Map };
