import { Box, Typography } from '@mui/material';
import PageContainer from 'components/PageContainer/PageContainer';
import style from './Home.style';

function Home() {
  /** Mot used yet (routing home to map) */
  return (
    <PageContainer {...style.ContainerProps}>
      <Box {...style.MainContainerProps}>
        <Typography {...style.TypographyProps}>
          home, sweet home...
        </Typography>
      </Box>
    </PageContainer>
  );
}

export default Home;
