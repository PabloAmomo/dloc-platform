import { Box, FormControl, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { useTranslation } from 'react-i18next';
import style from './TypeSelector.style';
import IconMarker from 'components/IconMarker/IconMarker';

const TypeSelector = (props: TypeSelectorProps) => {
  const { type, setType, types, typeName, placeholder, selectables = [], fillColor } = props;
  const { t } = useTranslation();

  const onChange = (event: SelectChangeEvent) => setType(event.target.value as any);

  return (
    <FormControl fullWidth>
      <Select value={type} placeholder={t(placeholder)} onChange={onChange} {...style.SelectProps}>
        {Object.keys(types)
          .filter((value) => selectables.includes(value) || selectables.length === 0)
          .map((value: string) => (
            <MenuItem key={value} value={value}>
              <Box {...style.ItemContainerProps}>
                <IconMarker iconType={types[value]} fillColor={fillColor} hasImage={false}  size={24} imei='' alt={t(`${typeName}.${value}`)} sharedWithOthers={false} aria-label={t(`${typeName}.${value}`)} {...style.ItemIconProps} />
                <Box {...style.ItemTextProps}>{t(`${typeName}.${value}`)}</Box>
              </Box>
            </MenuItem>
          ))}
      </Select>
    </FormControl>
  );
};

export default TypeSelector;

interface TypeSelectorProps {
  fillColor: string;
  placeholder: string;
  selectables?: string[];
  setType: { (type: any): void };
  type: string;
  typeName: string;
  types: any;
}
