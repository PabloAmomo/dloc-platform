import { SxProps } from "@mui/material";

const TypeSelectorStyle = {
  ItemContainerProps: { sx: { display: 'flex', flexDirection: 'row', width: '100%' } as SxProps },
  ItemTextProps: { sx: { alignItems: 'center', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' } as SxProps },
  ItemIconProps: { sx: { mr: 1 } as SxProps},
  SelectProps: { sx: { '& .MuiSelect-select': { p: '12px 12px' } } as SxProps } 
};

export default TypeSelectorStyle;
