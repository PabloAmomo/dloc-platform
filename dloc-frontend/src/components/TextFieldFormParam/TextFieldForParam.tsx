import { Grid, SxProps, TextField, TextFieldProps } from '@mui/material';
import { ReactNode } from 'react';
import style from './TextFieldForParam.style';

const TextFieldForParam = (props: TextFieldProps & extraProps) => {
  const { onChange, maxLength, label, value, disabled, isNumeric, helperText, error, withOutGrid, sx, regex } = props;

  const onChangePre = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (regex && !regex.test(value)) return;
    if (isNumeric && value !== '' && isNaN(Number(value))) return;
    onChange && onChange(e);
  };

  const Field: ReactNode = (
    <TextField
      sx={sx}
      error={error}
      helperText={disabled ? '' : helperText}
      disabled={disabled}
      onChange={onChangePre}
      inputProps={{ maxLength }}
      value={value}
      label={label}
      {...style.TextField}
    />
  );

  if (withOutGrid) return Field;
  else
    return (
      <Grid item xs={12}>
        {Field}
      </Grid>
    );
};

export default TextFieldForParam;

interface extraProps {
  maxLength: number;
  isNumeric?: boolean;
  withOutGrid?: boolean;
  sx?: SxProps;
  regex?: RegExp;
}
