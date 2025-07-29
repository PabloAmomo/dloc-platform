import { Box } from "@mui/material";
import { Colors } from "enums/Colors";
import { configApp } from "config/configApp";
import { Device } from "models/Device";
import { useTranslation } from "react-i18next";
import { EnergySavingsLeaf, VisibilityOff } from "@mui/icons-material";
import BatteryIcon from "components/BatteryIcon/BatteryIcon";
import calculateTime from "functions/calculateTime";
import convertUTCDateToLocalDate from "functions/convertUTCDateToLocalDate";
import style from "./MapMarkerLabel.style";
import IconMarker from "components/IconMarker/IconMarker";
import { PowerProfileType } from "enums/PowerProfileType";

const MapMarkerLabel = (props: MapMarkerLabelProps) => {
  const {
    device,
    zIndexOffset,
    hideTooltip,
    onClick = () => {},
    opacity = 1,
    className = "",
  }: MapMarkerLabelProps = props;
  const { t } = useTranslation();

  const battery = !device.batteryLevel
    ? 0
    : device.batteryLevel >= 95
    ? 10
    : Math.floor(device?.batteryLevel / 10);

  const dateLastPosition: Date | undefined = convertUTCDateToLocalDate(
    device.lastPositionUTC
  );
  const calculatedLastPosition = calculateTime(
    dateLastPosition ?? undefined,
    t("calculateTime", { returnObjects: true })
  );
  const outOffPosition =
    calculatedLastPosition.seconds > configApp.secondsOutOffPosition;

  const dateLastVisivility: Date | undefined = convertUTCDateToLocalDate(
    device.lastVisibilityUTC
  );
  const calculatedLastVisibility = calculateTime(
    dateLastVisivility ?? undefined,
    t("calculateTime", { returnObjects: true })
  );
  const outOffVisibility =
    calculatedLastVisibility.seconds > configApp.secondsOutOffVisibility;
  const outOffVisibilityBattery =
    calculatedLastVisibility.seconds > configApp.secondsOutOffVisibilityBattery;

  const finalClassName = `${className.trim()}${
    hideTooltip ? " marker-no-tooltip" : ""
  }`;

  let powerProfile =
    battery === 0 ||
    outOffVisibilityBattery ||
    device.powerProfile == PowerProfileType.AUTOMATIC_FULL ||
    device.powerProfile == PowerProfileType.FULL ? (
      <></>
    ) : (
      <EnergySavingsLeaf sx={{ ...style.batteryProfileIconProps.sx }} />
    );

  return (
    <Box
      onClick={onClick}
      className={finalClassName}
      {...style.containerProps}
      style={zIndexOffset ? { zIndex: zIndexOffset, opacity } : { opacity }}
    >
      {/* Device Name */}
      {!hideTooltip && (
        <Box {...style.deviceNameProps}>{device.params.name}</Box>
      )}

      {/* Last position */}
      {!hideTooltip && outOffPosition && (
        <Box {...style.deviceLastPositionProps}>
          <span style={{ color: Colors.red }}>
            {calculatedLastPosition.text}
          </span>
        </Box>
      )}

      {/* Battery */}
      <Box
        {...(!hideTooltip
          ? style.batteryProps
          : style.batteryTooltipHiddenProps)}
        {...style.batteryImageProps(battery * 10 < 3)}
      >
        <Box {...style.batteryIconBackProps}></Box>
        <BatteryIcon
          iconSet={"bar"}
          level={outOffVisibilityBattery ? -1 : battery * 10}
          iconSize={24}
          fontSize={0}
        />
        {powerProfile && (
          <Box {...style.batteryPowerProfileProps}>{powerProfile}</Box>
        )}
      </Box>

      {/* Marker Icon */}
      <IconMarker
        iconType={device.params.endTrack}
        hasImage={device.params.hasImage}
        fillColor={device.params.markerColor}
        imei={device.imei}
        sharedWithOthers={device.params.sharedWiths?.length > 0}
        {...style.IconMarkerProps}
      />

      {/* Out of position */}
      {outOffVisibility && (
        <Box
          {...(style.deviceOutOffVisibilityProps)}
        >
        <Box {...style.deviceOutOffVisibilityIconBackProps}></Box>
        <VisibilityOff {...style.deviceOutOffVisibilityIconProps} />
        </Box>
      )}
    </Box>
  );
};

export default MapMarkerLabel;

interface MapMarkerLabelProps {
  device: Device;
  hideTooltip?: boolean;
  onClick?: () => void;
  opacity?: number;
  zIndexOffset?: number;
  className?: string;
}
