import { AssignmentInd, ContactMail, Logout } from '@mui/icons-material';
import { Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { t } from 'i18next';
import { useNavigate } from 'react-router-dom';
import style from './SideMenuUser.style';

const SideMenuUser = (props: SideMenuUserProps) => {
  const { clickOnLogout } = props;
  const navigate = useNavigate();

  const clickOnProfile = () => navigate('/profile');
  const clickContactUs = () => navigate('/contact');

  return (
    <>
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={clickOnProfile}>
            <ListItemIcon>
              <AssignmentInd htmlColor={style.IconColor} />
            </ListItemIcon>
            <ListItemText primary={t('profile')} />
          </ListItemButton>
        </ListItem>
      </List>
      <Divider />

      <ListItem disablePadding>
        <ListItemButton onClick={clickContactUs}>
          <ListItemIcon>
            <ContactMail htmlColor={style.IconColor} />
          </ListItemIcon>
          <ListItemText primary={t('contactUs')} />
        </ListItemButton>
      </ListItem>
      <Divider />

      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={clickOnLogout}>
            <ListItemIcon>
              <Logout htmlColor={style.IconColor} />
            </ListItemIcon>
            <ListItemText primary={t('logout')} />
          </ListItemButton>
        </ListItem>
      </List>
    </>
  );
};

export default SideMenuUser;

interface SideMenuUserProps {
  clickOnLogout: { (): void };
}
