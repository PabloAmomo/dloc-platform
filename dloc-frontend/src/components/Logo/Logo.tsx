import { Box } from '@mui/material';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import style from './Logo.style';

const Logo = memo((props: LogoStyleProps) => {
  const { size } = props;
  const { t } = useTranslation();

  return <Box {...style.ContainerProps} sx={style.ContainerSx(size)} alt={t('brandLogo')} src="images/logos/logo192.webp" />;
});

export default Logo;

interface LogoStyleProps {
  size: number;
}
