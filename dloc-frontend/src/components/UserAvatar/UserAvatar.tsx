import { Avatar, ListItemIcon, ListItemText, Menu, MenuItem, MenuList } from '@mui/material';
import { Logout } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { UserProfile } from 'models/UserProfile';
import { useTranslation } from 'react-i18next';
import { useUserContext } from 'providers/UserProvider';
import UserAvatarStyle from './UserAvatar.style';
import LogoutDialog from 'components/LogoutDialog/LogoutDialog';

const UserAvatar = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [userProfile, setUserProfile] = useState<UserProfile>();
  const [openDialog, setOpenDialog] = useState(false);
  const { t } = useTranslation();
  const { user, isLoggedIn } = useUserContext();
  const open = Boolean(anchorEl);

  const clickAvatar = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  const onClose = () => setAnchorEl(null);

  const clickLogout = () => {
    setOpenDialog(true);
    onClose();
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => setUserProfile(isLoggedIn ? user?.profile : undefined), [isLoggedIn]);

  if (!userProfile || !isLoggedIn) return <></>;
  return (
    <>
      <LogoutDialog openDialog={openDialog} setOpenDialog={setOpenDialog} />

      <UserAvatarStyle.StyledBadgeProps overlap="circular" anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} variant="dot">
        <Avatar onClick={clickAvatar} {...UserAvatarStyle.AvatarProps} alt={userProfile.name} src={userProfile.image} />
      </UserAvatarStyle.StyledBadgeProps>

      <Menu anchorEl={anchorEl} open={open} onClose={onClose} MenuListProps={UserAvatarStyle.MenuListProps}>
        <MenuList dense>
          <MenuItem onClick={clickLogout}>
            <ListItemIcon>
              <Logout fontSize={UserAvatarStyle.LogoutFontSize as "inherit" | "small" | "medium" | "large" | undefined} />
            </ListItemIcon>
            <ListItemText>{t('logout')}</ListItemText>
          </MenuItem>
        </MenuList>
      </Menu>
    </>
  );
};

export default UserAvatar;
