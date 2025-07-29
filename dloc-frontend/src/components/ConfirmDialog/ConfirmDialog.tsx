import { Box, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import CloseIcon from '@mui/icons-material/Close';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import style from './ConfirmDialogStyle.style';
import Typography from '@mui/material/Typography';

const ConfirmDialog = (props: ConfirmDialogProps) => {
  const { isOpen, onYes, onNo, title, text, icon, yesText, noText, yesColor, noColor } = props;
  const { t } = useTranslation();

  /** Event Handlers */
  const clickYes = () => onYes && onYes();
  const clickNo = () => onNo && onNo();

  /** Render */
  return (
    <style.Dialog fullWidth={true} onClose={clickNo} open={isOpen}>
      <DialogTitle {...style.DialogTitleContainerProps}>
        {icon}
        <Box {...style.DialogTitleProps}>{title}</Box>
      </DialogTitle>

      <IconButton onClick={clickNo} {...style.CloseIconProps}>
        <CloseIcon />
      </IconButton>

      <DialogContent dividers>
        <Typography gutterBottom>{text}</Typography>
      </DialogContent>

      <DialogActions>
        <Button color={noColor ?? 'primary'} {...style.ActionButtonProps} onClick={clickNo}>
          {noText ?? t('no')}
        </Button>

        <Button color={yesColor} {...style.ActionButtonProps} onClick={clickYes}>
          {yesText ?? t('yes')}
        </Button>
      </DialogActions>
    </style.Dialog>
  );
};

export default ConfirmDialog;

interface ConfirmDialogProps {
  icon: JSX.Element;
  isOpen: boolean;
  noColor?: "error" | "success" | "warning" | "info" | "primary" | "secondary" | "inherit";
  noText?: string;
  onNo: { (): void };
  onYes: { (): void };
  text: string;
  title: string;
  yesColor?: "error" | "success" | "warning" | "info" | "primary" | "secondary" | "inherit";
  yesText?: string;
}
