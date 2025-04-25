import { Badge, MenuListProps, SxProps, Theme, styled } from '@mui/material';

const UserAvatarStyle = {
  AvatarProps: { 
    sx: { cursor: 'pointer' } as SxProps,
  },

  MenuListProps: { 'aria-labelledby': 'basic-button' } as MenuListProps,

  LogoutFontSize: 'small' as "inherit" | "small" | "medium" | "large" | undefined,

  StyledBadgeProps: styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
      backgroundColor: '#44b700',
      color: '#44b700',
      boxShadow: `0 0 0 2px ${(theme as Theme)?.palette?.background?.paper}`,
      '&::after': {
        position: 'absolute',
        top: '-1px',
        left: '-1px',
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        animation: 'ripple 1.2s infinite ease-in-out',
        border: '1px solid currentColor',
        content: '""',
      },
    },
    '@keyframes ripple': {
      '0%': {
        transform: 'scale(.8)',
        opacity: 1,
      },
      '100%': {
        transform: 'scale(2.4)',
        opacity: 0,
      },
    },
  })),
};

export default UserAvatarStyle;
