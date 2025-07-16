import { SxProps } from "@mui/material";
import { Colors } from "enums/Colors";
import { CSSProperties } from "react";

const ellipsis: SxProps = {
  textAlign: "center",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  width: "100%",
};

const MapMarkerLabelStyle = {
  containerProps: {
    sx: {
      display: "flex",
      width: "72px",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      fontSize: "8px",
    } as SxProps,
  },
  IconMarkerProps: {
    sx: { position: "absolute", left: "20px", top: "-40px" } as SxProps,
  },
  deviceNameProps: { sx: ellipsis },
  deviceLastPositionProps: { sx: ellipsis },
  batteryProps: {
    sx: { position: "absolute", left: "-6px", top: "-26px" } as SxProps,
  },

  batteryTooltipHiddenProps: {
    sx: { position: "absolute", left: "6px", top: "-30px" } as SxProps,
  },
  batteryIconBackProps: {
    sx: {
      position: "absolute",
      left: "7px",
      top: "4px",
      width: "10px",
      height: "18px",
      backgroundColor: Colors.white,
    } as SxProps,
  },
  batteryProfileIconProps: {
    sx: { width: 10, height: 10, fill: Colors.green } as SxProps,
  },
  batteryPowerProfileProps: {
    sx: {
      position: "absolute",
      right: -4,
      top: 2,
      width: 10,
      height: 10,
    } as SxProps,
  },
  deviceOutOffVisibilityIconBackProps: {
    sx: {
      position: "absolute",
      width: "11px",
      height: "7px",
      left: "2px",
      top: "4px",
      backgroundColor: Colors.white,
    } as SxProps,
  },
  deviceOutOffVisibilityIconProps: {
    sx: {
      position: "absolute",
      top: "0px",
      left: "0px",
      width: "16px",
      height: "16px",
    } as SxProps,
  },
  deviceOutOffVisibilityProps: {
    sx: {
      position: "absolute",
      right: "-2px",
      top: "-18px",
      width: "18px",
      height: "18px",
      textAlign: "center",
    } as SxProps,
  },


  batteryImageProps: (animation: boolean) => ({
    style: {
      animation: animation ? "blinker-25 1s linear infinite" : "none",
    } as CSSProperties,
  }),
};

export default MapMarkerLabelStyle;
