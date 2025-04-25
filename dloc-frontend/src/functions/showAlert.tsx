import { Close } from "@mui/icons-material";
import { Button } from "@mui/material";
import { Colors } from "enums/Colors";
import { SnackbarKey, closeSnackbar, enqueueSnackbar } from "notistack";

const showAlert = (message: string, variant: "default" | "error" | "success" | "warning" | "info") => {
  enqueueSnackbar(message, {
    variant: variant,
    autoHideDuration: 5000,
    persist: false,
    preventDuplicate: true,
    action: (key: SnackbarKey) => (
      <Button size="small" onClick={() => closeSnackbar(key)}>
        <Close sx={{ color: Colors.white }} />
      </Button>
    ),
  });
};

export default showAlert;

 