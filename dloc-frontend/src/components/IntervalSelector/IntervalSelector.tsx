import { Box, FormControl, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { memo, useCallback, useMemo } from 'react';
import { Option } from 'models/Option';
import { useTranslation } from 'react-i18next';
import RestoreIcon from '@mui/icons-material/Restore';
import style from './IntervalSelector.style';

const IntervalSelector = memo((props: IntervalSelectorProps) => {
  const { disabled = false, minutes, setMinutes } = props;
  const { t } = useTranslation();

  const options: Option[] = useMemo(
    () => [
      { value: 0, label: `${t('calculateTime.now')}...` },
      { value: 5, label: `5 ${t('calculateTime.minutes')}` },
      { value: 10, label: `10 ${t('calculateTime.minutes')}` },
      { value: 15, label: `15 ${t('calculateTime.minutes')}` },
      { value: 30, label: `30 ${t('calculateTime.minutes')}` },
      { value: 60, label: `1 ${t('calculateTime.hour')}` },
      { value: 90, label: `1.5 ${t('calculateTime.hours')}` },
      { value: 120, label: `2 ${t('calculateTime.hours')}` },
      { value: 240, label: `4 ${t('calculateTime.hours')}` },
      { value: 480, label: `8 ${t('calculateTime.hours')}` },
      { value: 720, label: `12 ${t('calculateTime.hours')}` },
      { value: 1440, label: `1 ${t('calculateTime.day')}` },
      { value: 2880, label: `2 ${t('calculateTime.days')}` },
    ],
    [t]
  );

  const handleMinutesChange = useCallback((event: SelectChangeEvent) => setMinutes(parseInt(event.target.value)), [setMinutes]);

  return (
    <Box {...style.ContainerProps}>
      <Box {...style.RestoreIconContainerProps}>
        <RestoreIcon sx={style.RestoreIcon.sx(disabled)} />
      </Box>
      <Box>
        <FormControl aria-label={t('minutes')}>
          <Select disabled={disabled} value={minutes.toString()} onChange={handleMinutesChange} {...style.SelectProps} aria-label={t('minutes')}>
            {options.map((option: Option) => (
              <MenuItem aria-label={option.label} key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    </Box>
  );
});

export default IntervalSelector;

interface IntervalSelectorProps {
  disabled?: boolean;
  minutes: number;
  setMinutes: (minutes: number) => void;
}
