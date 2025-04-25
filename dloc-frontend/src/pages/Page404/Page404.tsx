import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import PageContainer from 'components/PageContainer/PageContainer';
import style from './Page404.style';

function Page404() {
  const { t } = useTranslation();

  return (
    <PageContainer>
      <Box>
        <Typography {...style.TitleProps}>404</Typography>
        <Typography {...style.MessageProps}>{t('pageNotFound')}</Typography>
      </Box>
    </PageContainer>
  );
}

export default Page404;
