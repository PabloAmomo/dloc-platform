import { Box } from '@mui/material';
import style from './ContainerTop.style';

const ContainerTop = (props: ContainerTopProps) => {
  const { height, children } = props;

  return <Box sx={style.Container.sx(height)}>{children}</Box>;
};

export default ContainerTop;

interface ContainerTopProps { children: string | JSX.Element | JSX.Element[]; height: number }
