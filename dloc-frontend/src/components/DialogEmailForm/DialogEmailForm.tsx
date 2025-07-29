import { Box } from '@mui/material';
import { ShareTwoTone } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import style from './DialogEmailForm.style';
import TextField from '@mui/material/TextField';
import isEmail from 'functions/isEmail';

const DialogEmailForm = (props: DialogEmailFormProps) => {
  const { isOpen, setIsOpen, onSubmit, title, text, submitText, cancelText, onPreSubmit } = props;
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [email, setEmail] = useState('');
  const { t } = useTranslation();

  const handleClose = () => setIsOpen(false);
  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => setEmail(event.target.value);

  const handleOnSubmit = () => {
    if (onPreSubmit && !onPreSubmit(email)) return;
    onSubmit(email);
    handleClose();
  };

  useEffect(() => setEmail(''), [isOpen]);

  /** Check if the email is valid */
  useEffect(() => {
    const isValid = isEmail(email);
    setIsValidEmail(isValid);
  }, [email]);

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogTitle {...style.DialogTitleProps}>
        <ShareTwoTone {...style.DialogTitleIconProps} />
        <Box {...style.DialogTitleProps}>{title}</Box>
      </DialogTitle>
      <DialogContent>
        {text && <DialogContentText>{text}</DialogContentText>}
        <TextField
          value={email}
          onChange={handleOnChange}
          error={!isValidEmail}
          helperText={isValidEmail ? '' : t('emailHelper')}
          autoFocus
          required
          margin="dense"
          label={t('emailAddress')}
          type="email"
          fullWidth
          variant="standard"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>{cancelText}</Button>
        <Button disabled={!isValidEmail} onClick={handleOnSubmit}>{submitText}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogEmailForm;

interface DialogEmailFormProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onSubmit: (email: string) => void;
  title: string;
  text?: string;
  submitText: string;
  cancelText: string;
  onPreSubmit?: (email: string) => boolean;
}
