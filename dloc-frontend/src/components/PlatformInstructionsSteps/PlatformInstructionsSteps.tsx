import { Grid, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import ConfigInstructionLine from 'components/ConfigInstructionsLine/ConfigInstructionsLine';
import style from './PlatformInstructionsSteps.style';

const PlatformInstructionsSteps = (props: PlatformInstructionsStepsProps) => {
  const { stepsKey, preStepKey } = props;
  const { t } = useTranslation();
  const showPreStep = t(`${preStepKey}.prestep`) !== `${preStepKey}.prestep`;

  return (
    <Grid container spacing={2} mt={2}>
      {/* Pre-step */}
      {showPreStep && (
        <Grid item xs={12}>
          <Typography variant="h6">{t(`${preStepKey}.prestep.title`)}</Typography>
          <Typography variant="caption">
            {t(`${preStepKey}.prestep.text1`)}
            <br />
            <i>{t(`${preStepKey}.prestep.text2`)}</i>.
          </Typography>
        </Grid>
      )}

      {/* Instructions */}
      {[0, 1, 2, 3, 4, 5].map((item) =>
        ConfigInstructionLine(
          `${item}`,
          t(`${stepsKey}.step${item}.title`),
          t(`${stepsKey}.step${item}.resume`),
          t(`${stepsKey}.step${item}.command`),
          t(`${stepsKey}.step${item}.extraCommand`),
          t(`${stepsKey}.step${item}.response`)
        )
      )}

      {/* Final step */}
      <Grid item xs={12}>
        <Typography variant={'caption'}>{t(`${stepsKey}.step6.text1`)}</Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="caption" color={'grey'}>
          {t(`${stepsKey}.step6.text2`)}
        </Typography>
        <br />
        <Typography variant="caption">{t(`${stepsKey}.step6.text3`)}</Typography>
      </Grid>
    </Grid>
  );
};

interface PlatformInstructionsStepsProps {
  stepsKey: string;
  preStepKey: string;
}

export default PlatformInstructionsSteps;
