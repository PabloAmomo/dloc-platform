import { Box, Typography } from "@mui/material";
import { useDevicesContext } from "providers/DevicesProvider";
import { useTranslation } from "react-i18next";
import formatDate from "functions/formatDate";
import style from "./LastUpdateInfo.style";
import { useWebsocketContext } from "providers/WebsocketProvider";

const LastUpdateInfo = () => {
  const { t } = useTranslation();
  const { lastUpdate } = useDevicesContext();
  const { hasError } = useWebsocketContext();
  const dateText: string = lastUpdate
    ? formatDate(lastUpdate, t("dateString")) ?? "-"
    : "-";

  return (
    <Box {...style.ContainerProps}>
      <Typography {...style.TypographyProps}>
        {`${t("lastUpdate")} `}
        <b>{dateText}</b>
        <span {...style.ErrorSpanProps}>
          {hasError ? ` (${t("errors.noConnection")})` : ""}
        </span>
      </Typography>
    </Box>
  );
};

export default LastUpdateInfo;
