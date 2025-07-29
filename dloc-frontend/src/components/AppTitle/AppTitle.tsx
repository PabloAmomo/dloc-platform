import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import style from './AppTitle.style';

const AppTitle = () => {
  const { t } = useTranslation();

  return (
    <>
      <Typography {...style.TitleProps}>
        <span {...style.BrandSpanAltProps}>m</span>ai<span {...style.BrandSpanAltProps}>P</span>et<b></b>
      </Typography>
      <Typography {...style.SubtitleProps}>{t('brand.subtitle')}</Typography>
    </>
  );
};

export default AppTitle;
