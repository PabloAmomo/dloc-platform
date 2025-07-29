import { Box } from '@mui/material';
import { ReactNode } from 'react';
import style from './ContainerAllScreen.style';

const ContainerAllScreen = (props: ContainerAllScreenProps) => {
  const { children } = props;

  return (
    <Box {...style.ContainerProps}>
      <Box {...style.ChildrenContainerProps}>{children}</Box>
    </Box>
  );
};

export default ContainerAllScreen;

interface ContainerAllScreenProps {
  children: ReactNode;
}
