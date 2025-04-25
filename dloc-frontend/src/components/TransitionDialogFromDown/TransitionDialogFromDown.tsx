import { Slide } from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import { forwardRef } from "react";
import style from "./TransitionDialogFromDown.style";

const TransitionDialogFromDown = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction={style.direction as "up" | "left" | "right" | "down" | undefined} ref={ref} {...props} />;
});

export default TransitionDialogFromDown;