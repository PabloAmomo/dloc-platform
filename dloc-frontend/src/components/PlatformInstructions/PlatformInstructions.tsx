import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { useTranslation } from 'react-i18next';
import PlatformInstructionsSteps from 'components/PlatformInstructionsSteps/PlatformInstructionsSteps';
import style from './PlatformInstructions.style';

const PlatformInstructions = (props: PlatformInstructionsProps) => {
  const { isOpen, setIsOpen, titleKey, stepsKey, preStepKey, titleImage } = props;
  const { t } = useTranslation();
  const handleClose = () => setIsOpen(false);

  const showTitle = t(`${titleKey}.title`) !== `${titleKey}.title`;
  const showSteps = t(`${stepsKey}.step0.title`) !== `${stepsKey}.step0.title`;

  const subtitles = t(`${titleKey}.subtitle`).split('\n');

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      {showTitle && <DialogTitle {...style.DialogTitleProps}>{t(`${titleKey}.title`)}</DialogTitle>}

      <DialogContent>
        {showTitle && (
          <DialogContentText>
            {titleImage && <p><center><img {...style.TitleImageProps} src={titleImage} alt="title" /></center></p>}
            {subtitles.map((text, index) => (
              <p key={index}>{text}</p>
            ))}
          </DialogContentText>
        )}

        {showSteps && <PlatformInstructionsSteps stepsKey={stepsKey} preStepKey={preStepKey} />}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>
          {t('close')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PlatformInstructions;

interface PlatformInstructionsProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  titleImage?: string;
  titleKey: string;
  stepsKey: string;
  preStepKey: string;
}