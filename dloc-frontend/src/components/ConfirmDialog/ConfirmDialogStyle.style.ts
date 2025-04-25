import { Dialog, SxProps, Theme, styled } from '@mui/material';

const ConfirmDialogStyle = {
  Dialog: styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
      padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
      padding: theme.spacing(1),
    },
  })),
  DialogTitleContainerProps: {
    sx: { display: 'flex', flexWrap: 'nowrap', flexDirection: 'row', '& .MuiSvgIcon-root': { fill: '#898989', pt: '4px' } } as SxProps,
  },
  DialogTitleProps: {
    sx: {
      flexGrow: 1,
      textOverflow: 'ellipsis',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      pl: 1,
    } as SxProps,
  },
  CloseIconProps: {
    sx: {
      color: (theme: Theme) => theme.palette.grey[500],
      position: 'absolute',
      right: 8,
      top: 8,
    } as SxProps,
  },
  ActionButtonProps: {
    sx: {
      width: '12ch',
    } as SxProps,
  },
};

export default ConfirmDialogStyle;
