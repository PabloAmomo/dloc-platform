import { Logout } from '@mui/icons-material';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useUserContext } from 'providers/UserProvider';
import ConfirmDialog from 'components/ConfirmDialog/ConfirmDialog';


const LogoutDialog = (props: LogoutDialogProps) => {
  const { logout, isLoggedIn } = useUserContext();
  const { openDialog, setOpenDialog, onCancel }: LogoutDialogProps = props;
  const { t } = useTranslation();

  const onYes = () => {
    setOpenDialog(false);
    logout();
  };
  const onNo = () => {
    setOpenDialog(false);
    onCancel && onCancel();
  }

  useEffect(() => {
    if (!isLoggedIn && openDialog) setOpenDialog(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn]);

  return <ConfirmDialog icon={<Logout />} isOpen={openDialog} onYes={onYes} onNo={onNo} title={t('logout')} text={t('confirmLogout')} />;
};

interface LogoutDialogProps {
  openDialog: boolean;
  setOpenDialog: { (isOpen: boolean): void };
  onCancel?: { (): void };
}

export default LogoutDialog;
