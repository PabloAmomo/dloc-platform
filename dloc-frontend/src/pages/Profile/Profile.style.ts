import { GridSize, SxProps } from '@mui/material';

const ProfileStyle = {
  PageProps: { sx: { justifyContent: 'center' } as SxProps },
  GridItemProps: {
    sx: { display: 'flex', justifyContent: 'center' } as SxProps,
    xs: 12 as GridSize,
  },
  AvatarProps: { sx: { width: 72, height: 72 } as SxProps },
};

export default ProfileStyle;
