import { Box, Typography } from '@mui/material';
import { useDevicesContext } from 'providers/DevicesProvider';
import { useTranslation } from 'react-i18next';
import formatDate from 'functions/formatDate';
import style from './LastUpdateInfo.style';

const LastUpdateInfo = () => {
  const { t } = useTranslation();
  const { lastUpdate } = useDevicesContext();
  const dateText: string = lastUpdate ? formatDate(lastUpdate, t('dateString')) ?? '-' : '-';

  return (
    <Box {...style.ContainerProps}>
      <Typography {...style.TypographyProps}>
        {`${t('lastUpdate')} `}
        <b>{dateText}</b>
      </Typography>
    </Box>
  );
};

export default LastUpdateInfo;
