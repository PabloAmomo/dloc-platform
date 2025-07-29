import { Battery0BarTwoTone, Battery1BarTwoTone as Battery10Bar, Battery2BarTwoTone as Battery20Bar } from '@mui/icons-material';
import { Battery3BarTwoTone as Battery30Bar, Battery4BarTwoTone as Battery40Bar } from '@mui/icons-material';
import { Battery20 as Battery10, Battery20, Battery30, Battery30 as Battery40, Battery50 } from '@mui/icons-material';
import { Battery6BarTwoTone as Battery70Bar, Battery6BarTwoTone as Battery80Bar } from '@mui/icons-material';
import { Battery4BarTwoTone as Battery50Bar, Battery5BarTwoTone as Battery60Bar } from '@mui/icons-material';
import { Battery60, Battery60 as Battery70, Battery80, Battery0Bar } from '@mui/icons-material';
import { BatteryFull, BatteryUnknown } from '@mui/icons-material';
import { Box, SxProps, Typography } from '@mui/material';
import style from './BatteryIcon.style';

const BatteryIcon = (props: BatteryIconProps) => {
  const { level, iconSize = 24, fontSize = 12, iconSet = 'normal' }: BatteryIconProps = props;
  const iconColor: string = level > 50 ? style.Colors.green : level > 20 ? style.Colors.yellow : style.Colors.red;
  const iconSx: SxProps = { width: `${iconSize}px`, height: `${iconSize}px`, color: iconColor };
  const fontSx: SxProps = { lineHeight: `${iconSize + 1}px`, fontSize: `${fontSize}px` };
  const IconSetTypeNormal = iconSet === 'normal';

  const Icon =
    level === -1 ? (
      <BatteryUnknown sx={iconSx} />
    ) : level > 98 ? (
      <BatteryFull sx={iconSx} />
    ) : level > 80 ? (
      IconSetTypeNormal ? (
        <Battery80 sx={iconSx} />
      ) : (
        <Battery80Bar sx={iconSx} />
      )
    ) : level > 70 ? (
      IconSetTypeNormal ? (
        <Battery70 sx={iconSx} />
      ) : (
        <Battery70Bar sx={iconSx} />
      )
    ) : level > 60 ? (
      IconSetTypeNormal ? (
        <Battery60 sx={iconSx} />
      ) : (
        <Battery60Bar sx={iconSx} />
      )
    ) : level > 50 ? (
      IconSetTypeNormal ? (
        <Battery50 sx={iconSx} />
      ) : (
        <Battery50Bar sx={iconSx} />
      )
    ) : level > 40 ? (
      IconSetTypeNormal ? (
        <Battery40 sx={iconSx} />
      ) : (
        <Battery40Bar sx={iconSx} />
      )
    ) : level > 30 ? (
      IconSetTypeNormal ? (
        <Battery30 sx={iconSx} />
      ) : (
        <Battery30Bar sx={iconSx} />
      )
    ) : level > 20 ? (
      IconSetTypeNormal ? (
        <Battery20 sx={iconSx} />
      ) : (
        <Battery20Bar sx={iconSx} />
      )
    ) : level > 5 ? (
      IconSetTypeNormal ? (
        <Battery10 sx={iconSx} />
      ) : (
        <Battery10Bar sx={iconSx} />
      )
    ) : IconSetTypeNormal ? (
      <Battery0Bar sx={iconSx} />
    ) : (
      <Battery0BarTwoTone sx={iconSx} />
    );

  return (
    <Box {...style.ContainerProps}>
      {Icon}
      {level !== -1 && fontSize !== 0 && (
        <Typography variant="caption" sx={fontSx}>
          {level}%
        </Typography>
      )}
    </Box>
  );
};

export default BatteryIcon;

interface BatteryIconProps {
  iconSet?: 'normal' | 'bar';
  level: number;
  iconSize?: number;
  fontSize?: number;
}
