import CircularLoading from 'components/CircularLoading/CircularLoading';
import PageContainer from 'components/PageContainer/PageContainer';
import style from './LoadingPage.style';

function LoadingPage() {
  return (
    <PageContainer {...style.ContainerProps}>
      <CircularLoading />
    </PageContainer>
  );
}

export default LoadingPage;