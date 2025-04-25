import { Grid, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import style from "./ConfigInstructionsLine.style";

const ConfigInstructionLine = (key: string, title: string, resume: string, command: string, extraCommand: string, response: string) => {
  const { t } = useTranslation();

  return (
    <Grid key={key} item xs={12} {...style.ConfigLineProps}>
      <Typography variant="h6">{title}</Typography>

      <Typography variant="caption">{resume}</Typography>
      
      {command && (
        <Typography pl={1} variant="caption">
          {t('instructions.sendSMS')} <b>{command}</b>
          {extraCommand && ` (${extraCommand})`}
        </Typography>
      )}
      
      {response && (
        <Typography pl={1} variant="caption">
          {t('instructions.response')} <i>{response}</i>
        </Typography>
      )}
    </Grid>
  );
};

export default ConfigInstructionLine;