import { Avatar, Grid, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { UserProfile } from 'models/UserProfile';
import { useUserContext } from 'providers/UserProvider';
import PageContainer from 'components/PageContainer/PageContainer';
import style from './Profile.style';

function Profile() {
  const [userProfile, setUserProfile] = useState<UserProfile>();
  const { user, isLoggedIn } = useUserContext();

  useEffect(() => {
    setUserProfile(isLoggedIn ? user.profile : undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn]);

  /** Leave only one name if is repeated */
  let name: string = userProfile?.name ?? '';
  let parts = name.split(' ');
  if (parts.length > 1 && parts[0] === parts[1]) name = parts[0];

  return (
    <PageContainer {...style.PageProps}>
      <Grid container spacing={2}>
        <Grid {...style.GridItemProps} item>
          <Avatar alt={userProfile?.name} src={userProfile?.image} {...style.AvatarProps} />
        </Grid>
        <Grid {...style.GridItemProps} item>
          <Typography variant="body1">{name}</Typography>
        </Grid>
        <Grid {...style.GridItemProps} item>
          <Typography variant="body1">{userProfile?.email}</Typography>
        </Grid>
      </Grid>
    </PageContainer>
  );
}

export default Profile;
