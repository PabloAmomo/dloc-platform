import { PathOptions } from 'leaflet';
import { Property } from 'csstype';
import { SxProps } from '@mui/material';
import { Variant } from '@mui/material/styles/createTypography';

const LeafletMapStyle = {
  ContainerSx: { width: '100%', height: '100%', zIndex: 0 } as SxProps,
  MapContainerProps: { style: { width: '100%', height: '100%', zIndex: 0 } as React.CSSProperties },
  PolilyneStyle: { lineCap: 'round', lineJoin: 'round', weight: 1 } as PathOptions,
  ArrowIconPopup: {
    Container: { sx: { display: 'flex', flexDirection: 'row', pt: '4px', pr: 1 } as SxProps },
    Icon: { sx: { width: '14px', height: '14px', mr: 1 } as SxProps },
    Typography: { sx: { lineHeight: '14px' } as SxProps, color: 'textPrimary' as Property.Color, variant: "caption" as Variant },
  },
};

export default LeafletMapStyle;
