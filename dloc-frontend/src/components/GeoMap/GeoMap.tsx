import 'styles/geoMap.style.css';
import { configApp } from 'config/configApp';
import { GetPositionsStrategy } from 'models/GetPositionsStrategy';
import { LinearProgress } from '@mui/material';
import { logError } from 'functions/logError';
import { useEffect } from 'react';
import { useGetPositionsHook } from 'hooks/GetPositionsHook';
import { useGetPositionsStrategyHTTPSHook } from 'hooks/GetPositionsStartegyHTTPSHook';
import ContainerAllScreen from 'components/ContainerAllScreen/ContainerAllScreen';
import ContainerTop from 'components/ContainerTop/ContainerTop';
import GeoMapBottomMenu from 'components/GeoMapBottomMenu/GeoMapBottomMenu';
import GeoMapButtons from 'components/GeoMapButtons/GeoMapButtons';
import LastUpdateInfo from 'components/LastUpdateInfo/LastUpdateInfo';
import LeafletMap from 'components/LeafletMap/LeafletMap';
import useGetPositionsStartegyWebSocketHook from 'hooks/GetPositionsStartegyWebSocketHook';

function GeoMap() {
  const { isGettingData, getPositions, setLastUpdate, processResponse, setRunDataAdquistion } = useGetPositionsHook({});

  /** Set the strategy to get the positions */
  const strategy: GetPositionsStrategy | null =
    configApp.getPositionsStartegy === 'websocket'
      ? useGetPositionsStartegyWebSocketHook({ getPositions, setLastUpdate, processResponse, setRunDataAdquistion })
      : configApp.getPositionsStartegy === 'https'
      ? useGetPositionsStrategyHTTPSHook({ getPositions, setLastUpdate, processResponse, setRunDataAdquistion })
      : null;

  /** Check if the strategy is valid */
  useEffect(() => {
    if (!strategy) logError('Invalid strategy to get the positions');
  }, []);

  /** Draw the Map */
  return (
    <>
      <ContainerAllScreen>
        {/* Map */}
        <LeafletMap />

        {/* Action Buttons */}
        <GeoMapButtons />

        {/* Last update */}
        <LastUpdateInfo />

        {/* Linear Loading */}
        <ContainerTop height={isGettingData ? 4 : 0}>
          <LinearProgress color="primary" aria-label="progress bar" />
        </ContainerTop>
      </ContainerAllScreen>

      <GeoMapBottomMenu />
    </>
  );
}

export default GeoMap;
