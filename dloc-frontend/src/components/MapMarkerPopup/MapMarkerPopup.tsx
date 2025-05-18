import { Avatar, Box, SxProps } from "@mui/material";
import { configApp } from "config/configApp";
import { Device } from "models/Device";
import { MapPath } from "models/MapPath";
import { useDevicesFormContext } from "providers/DeviceFormProvider";
import { useMapContext } from "providers/MapProvider";
import { useTranslation } from "react-i18next";
import { Bolt, EnergySavingsLeafTwoTone, Wifi, WifiOff } from "@mui/icons-material";
import BatteryIcon from "components/BatteryIcon/BatteryIcon";
import calculateTime from "functions/calculateTime";
import convertUTCDateToLocalDate from "functions/convertUTCDateToLocalDate";
import ForkRightTwoTone from "@mui/icons-material/ForkRightTwoTone";
import formatDate from "functions/formatDate";
import getDeviceImagePathByImei from "functions/getDeviceImagePathByImei";
import HoldIcon from "@mui/icons-material/VolunteerActivism";
import LocationOnTwoTone from "@mui/icons-material/LocationOnTwoTone";
import MapTwoTone from "@mui/icons-material/MapTwoTone";
import SettingsIcon from "@mui/icons-material/Settings";
import SpeedIcon from "@mui/icons-material/SpeedTwoTone";
import style from "./MapMarkerPopup.style";
import VisibilityTwoTone from "@mui/icons-material/VisibilityTwoTone";
import { useWebsocketContext } from "providers/WebsocketProvider";
import { WebSocketDataCommands } from "enums/WebSocketDataCommands";
import { PowerProfileType } from "enums/PowerProfileType";

const MapMarkerPopup = (props: MapMarkerPopupProps) => {
  const {
    device,
    zIndexOffset,
    onClick = () => {},
  }: MapMarkerPopupProps = props;
  const { openFormDevice } = useDevicesFormContext();
  const { t } = useTranslation();
  const { visiblePaths } = useMapContext();
  const { sendCommand } = useWebsocketContext();

  const datePosition: Date | undefined = convertUTCDateToLocalDate(
    device.lastPositionUTC
  );
  const dateVisibility: Date | undefined = convertUTCDateToLocalDate(
    device.lastVisibilityUTC
  );

  const datePositionText: string = datePosition
    ? formatDate(datePosition, t("dateString")) ?? "-"
    : "-";
  const dateVisibilityText: string = dateVisibility
    ? formatDate(dateVisibility, t("dateString")) ?? "-"
    : "-";

  const i18n: any = t("calculateTime", { returnObjects: true });
  const calculatedTimePosition: string = datePosition
    ? `(${calculateTime(datePosition, i18n).text.toLowerCase()})`
    : "";
  const calculatedTimeVisibility: string = dateVisibility
    ? `(${calculateTime(dateVisibility, i18n).text.toLowerCase()})`
    : "";

  const calculatDateVisibility = calculateTime(
    dateVisibility ?? undefined,
    t("calculateTime", { returnObjects: true })
  );
  const outOffVisibility =
    calculatDateVisibility.seconds > configApp.secondsOutOffVisibility;
  const outOffVisibilityBattery =
    calculatDateVisibility.seconds > configApp.secondsOutOffVisibilityBattery;

  const distanceInMeters: number =
    visiblePaths.find((path: MapPath) => path.imei === device.imei)?.distance ??
    0;
  const distance: string =
    distanceInMeters < 10000
      ? `${distanceInMeters.toFixed(0)} ${t("meters")}`
      : `${(distanceInMeters / 1000).toFixed(2) ?? "0"} ${t("kilometers")}`;

  const speedInKmH =
    visiblePaths.find((path: MapPath) => path.imei === device.imei)?.speed ?? 0;

  const handleOpenConfig = (event: React.MouseEvent<HTMLDivElement>) =>
    openFormDevice(device);

  const handleChangeToAutomaticFull = (
    event: React.MouseEvent<HTMLDivElement>
  ) => {
    event.stopPropagation();
    sendCommand(WebSocketDataCommands.UpdatePowerProfile, {
      imei: device.imei,
      powerProfile: PowerProfileType.AUTOMATIC_FULL,
    });
  };

  const showChangeToAutomaticFull =
    device.powerProfile !== PowerProfileType.AUTOMATIC_FULL &&
    device.powerProfile.startsWith("automatic_");

  const LineItem = (
    sx: SxProps,
    label: string | JSX.Element,
    value: string | JSX.Element
  ) => (
    <Box
      {...style.LineItem.ContainerProps}
      sx={{ ...style.LineItem.ContainerProps.sx, ...sx } as SxProps}
    >
      {label !== "" && <Box {...style.LineItem.TitleSpanProps}>{label}</Box>}
      <Box {...style.LineItem.ValueSpanProps}>{value}</Box>
    </Box>
  );

  return (
    <Box
      onClick={onClick}
      {...style.ContainerProps}
      style={zIndexOffset ? { zIndex: zIndexOffset } : {}}
    >
      {/* Has Image */}
      {device.params.hasImage && (
        <Box {...style.AvatarContainerProps}>
          <Avatar
            variant="rounded"
            alt=""
            src={getDeviceImagePathByImei(device.imei)}
            {...style.AvatarProps}
          />
        </Box>
      )}

      {/* Name */}
      <Box {...style.NameContainerProps}>
        <Box component={"span"}>{device.params.name}</Box>
      </Box>

      {/* Last Position  t('lastTime') */}
      {LineItem(
        style.LastTimeSx,
        <LocationOnTwoTone {...style.ItemIconProp} />,
        <b>{`${datePositionText} ${calculatedTimePosition}`}</b>
      )}

      {/* Distance t('distance') */}
      {distanceInMeters > 0 &&
        LineItem(
          style.DistanceSx,
          <ForkRightTwoTone {...style.ItemIconProp} />,
          distance
        )}

      {/* Speed t('avreagekm/h') */}
      {speedInKmH > 0 &&
        LineItem(
          style.PositionSx,
          <SpeedIcon {...style.ItemIconProp} />,
          `${speedInKmH.toFixed(2)} ${t("avreagekm/h")}`
        )}

      {/* Last visibility  t('lastVisibility') */}
      {LineItem(
        style.LastVisibilityProps,
        <VisibilityTwoTone {...style.ItemIconProp} />,
        <>{`${dateVisibilityText} ${calculatedTimeVisibility}`}</>
      )}

      {/* Position (lat and Lng) `${t('position')}` */}
      {LineItem(
        style.PositionSx,
        <MapTwoTone {...style.ItemIconProp} />,
        `${device?.lat ?? "-"} - ${device?.lng ?? "-"}`
      )}

      {/* Power profile */}
      {LineItem(
        style.PositionSx,
        <EnergySavingsLeafTwoTone {...style.ItemIconProp} />,
        t(`powerProfile.${device?.powerProfile}`)
      )}

      {/* Change to Power Profile automatic_full */}
      {showChangeToAutomaticFull &&
        LineItem(
          style.PositionSx,
          "",
          <Box
            onClick={handleChangeToAutomaticFull}
            {...style.ChangeToAutomaticFullProps}
          >
            <Bolt {...style.hangeToAutomaticFullIconProp} />
            {t("changeToFull")}
            <Bolt {...style.hangeToAutomaticFullIconProp} />
          </Box>
        )}

      {/* Battery */}
      <Box {...style.BatteryIconContainerProps}>
        <BatteryIcon
          {...style.BatteryIconProps}
          level={outOffVisibilityBattery ? -1 : device?.batteryLevel ?? -1}
        />
      </Box>

      {/* Open Config */}
      <Box onClick={handleOpenConfig} {...style.OpenConfigIconContainerProps}>
        {<SettingsIcon {...style.OpenConfigIconProps} />}
      </Box>

      {/* Is shared with somebody - Open Config */}
      {device?.params?.sharedWiths &&
        device?.params?.sharedWiths?.length > 0 && (
          <Box
            onClick={handleOpenConfig}
            {...style.SharedWithIconContainerProps}
          >
            {<HoldIcon {...style.SharedWithIconProps} />}
          </Box>
        )}

      {/* Visibility */}
      <Box {...style.VisibilityIconContainerProps}>
        {outOffVisibility ? (
          <WifiOff {...style.VisibilityIconProps.WithOutVisibility} />
        ) : (
          <Wifi {...style.VisibilityIconProps.WithVisibility} />
        )}
      </Box>
    </Box>
  );
};

export default MapMarkerPopup;

interface MapMarkerPopupProps {
  device: Device;
  zIndexOffset?: number;
  onClick?: () => void;
}
