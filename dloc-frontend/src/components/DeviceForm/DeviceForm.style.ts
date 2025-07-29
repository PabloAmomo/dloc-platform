import { PropTypes, SxProps, Theme } from '@mui/material';
import { Variant } from '@mui/material/styles/createTypography';

const DeviceFormStyle = {
  NameAndAvatarGridContainerProps: {
    sx: { pt: '8px!important' } as SxProps,
  },
  PetTypeGridContainerProps: {
    sx: { pt: '0!important' } as SxProps,
  },
  DialogProps: {
    sx: {
      '& .MuiDialogContent-root': { pl: { xs: 2, md: 3 }, pr: { xs: 2, md: 3 } },
      '& .MuiPaper-root': { ml: { xs: 2, md: 3 }, mr: { xs: 2, md: 3 } },
    } as SxProps,
  },
  NameInputProps: {
    sx: { '& .MuiFormHelperText-root': { fontSize: { xs: '.55rem', md: '.75rem' } } } as SxProps,
  },
  AvatarProps: {
    sx: { width: { xs: 48, sm: 64, md: 72 }, height: { xs: 48, sm: 64, md: 72 }, boxShadow: 3, bgcolor: '#eaeaea', cursor: 'pointer', '& img': { backgroundColor: 'white' } } as SxProps,
  },
  SharedText: {
    color: 'primary',
    sx: { fontSize: '8px', position: 'absolute', top: '-6px' } as SxProps,
  },
  ButtonShareWithsProps: {
    sx: { maxWidth: '200px' } as SxProps,
  },
  ImeiAccordionSummaryProps: {
    sx: { p: 0, minHeight: '16px!important', '& .MuiAccordionSummary-content': { mt: '0!important', mb: '0!important' }, overflow: 'hidden' } as SxProps,
  },
  CopyIconContainerProps: {
    sx: { cursor: 'pointer', display: 'flex', '& .MuiTypography-root': { fontSize: '10px' } } as SxProps,
  },
  CopyIconProps: {
    sx: { fontSize: '18px', color: 'primary', marginLeft: '1rem', cursor: 'pointer' } as SxProps,
  },
  ImeiAccordionSummaryImeProps: {
    sx: { paddingLeft: '1ch' } as SxProps,
    variant: 'body1' as Variant,
    color: 'textSecondary' as PropTypes.Color,
  },
  DialogTitleIconProps: {
    sx: { pr: 1, pt: '4px' } as SxProps,
    color: 'primary' as 'disabled' | 'action' | 'inherit' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning',
  },
  DialogTitleTextProps: {
    sx: { flexGrow: 1, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', mr: '1.25rem' } as SxProps,
  },
  DialogTitleProps: {
    sx: { display: 'flex', flexWrap: 'nowrap', flexDirection: 'row', pb: 0 } as SxProps,
  },
  ActionButtonProps: {
    sx: {
      width: '12ch',
      fontSize: { xs: '0.70rem', sm: '0.875rem' },
      lineHeight: { xs: '1.75', sm: '1.75' },
    } as SxProps,
  },
  CircularLoadingProps: {
    sx: {
      fontSize: '12px',
      backgroundColor: 'transparent',
      '& .MuiCircularProgress-root': { width: '14px!important', height: '14px!important' },
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
  DialogActionsProps: {
    sx: { justifyContent: { xs: 'space-between', sm: 'flex-end' } } as SxProps,
  },
  DialogActionsSeparatorProps: {
    flexGrow: { xs: '0', sm: '1' },
    display: { xs: 'none', sm: 'inherit' },
  },
  ResetAvatarIconProps: {
    sx: {
      fontSize: '1.5rem',
      position: 'absolute',
      right: '-10px',
      top: '10px',
      backgroundColor: 'white',
      zIndex: 1,
      borderRadius: '50%',
      p: '2px',
      boxShadow: 3,
    } as SxProps,
  },
  AvatarGridContainerProps: {
    sx: { pl: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', cursor: 'pointer' } as SxProps,
  },
  AvatarDeleteButtonProps: {
    sx: { ml: 0, mr: 0, pl: 0, pr: 0, fontSize: { xs: '0.70rem', sm: '0.875rem' } } as SxProps,
  },
  AvatarContainerProps: {
    sx: { display: 'flex', justifyContent: 'center', alignItems: 'center' } as SxProps,
  },
};

export default DeviceFormStyle;
