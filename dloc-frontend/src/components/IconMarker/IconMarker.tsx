import { Box, SxProps, Typography } from '@mui/material';
import { IconType } from 'enums/IconType';
import { useTranslation } from 'react-i18next';
import getDeviceImagePathByImei from 'functions/getDeviceImagePathByImei';
import getMarkerIcon from 'functions/getMarkerIcon';
import getNoImagePath from 'functions/getNoImagePath';
import HoldIcon from '@mui/icons-material/VolunteerActivism';
import style from './IconMarker.style';

const SHARED_NAME_TOP = '-11px';

const IconMarker = (props: IconMarkerProps) => {
  const { iconType, fillColor, imei, sx, isShared, size, alt, ariaLabel, hasImage, sharedWithOthers } = props;
  const { t } = useTranslation();
  const deviceImagePath = !hasImage ? getNoImagePath() : getDeviceImagePathByImei(imei);
  const sizeValue = size ?? 32;

  const markerIcon = getMarkerIcon(iconType, { fillColor, size: sizeValue });
  const width = `${sizeValue}px`;
  const height = `${sizeValue}px`;
  const imageWidth = `${sizeValue - 10}px`;
  const imageHeight = imageWidth;

  return (
    <Box sx={{ width, height, '& img': { width, height }, ...sx }}>
      <Box {...style.MarkerInternalContainerProps}>
        {isShared && (
          <Typography color={style.SharedTextProps.color} sx={{ ...style.SharedTextProps.sx, top: SHARED_NAME_TOP }}>
            {t('shared')}
          </Typography>
        )}

        {iconType === IconType.image && (
          <img style={{ ...style.MarkerIconImageProps.style, width: imageWidth, height: imageHeight }} src={deviceImagePath} alt={t('petImage')} />
        )}
        <img src={markerIcon} {...style.MarkerIconProps} alt={alt ?? t('petMarker')} aria-label={ariaLabel ?? t('petMarker')} />

        {sharedWithOthers && <HoldIcon {...style.MarkerIconHoldProps} />}
      </Box>
    </Box>
  );
};

export default IconMarker;

interface IconMarkerProps {
  iconType: IconType;
  hasImage: boolean;
  fillColor: string;
  imei: string;
  sx?: SxProps;
  isShared?: boolean;
  size?: 24 | 28 | 32;
  alt?: string;
  ariaLabel?: string;
  sharedWithOthers: boolean;
}
