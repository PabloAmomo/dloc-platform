import { Box, FormControl, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { Colors } from 'enums/Colors';
import { useTranslation } from 'react-i18next';
import style from './ColorPicker.style';

const ColorPicker = (props: ColorPickerProps) => {
  const { color, setColor, colorsList, disabled = false, showLabel } = props;
  const { t } = useTranslation();
  const colors: Color[] = colorsList ?? Object.keys(Colors).map((key: string) => ({ name: key, value: (Colors as any)[key] }));

  const onChange = (event: SelectChangeEvent) => setColor(event.target.value as string);

  return (
    <FormControl fullWidth>
      <Select value={color} disabled={disabled} placeholder={t('language')} onChange={onChange} {...style.SelectProps}>
        {colors.map(({ name, value }: Color) => (
          <MenuItem key={name} value={value}>
            <Box {...style.MenuItemContainerProps}>
              <span aria-label={t(`colors.${name}`)} style={style.ColorIcon.style(value, disabled)}></span>
              {showLabel && <span style={style.ColorName.style}>{t(`colors.${name}`)}</span>}
            </Box>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default ColorPicker;

type Color = { name: string; value: string };
interface ColorPickerProps {
  color: string;
  setColor: { (color: string): void };
  colorsList?: Color[];
  disabled?: boolean;
  showLabel?: boolean;
}
