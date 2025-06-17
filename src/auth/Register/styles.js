import {
  Box,
  Checkbox,
  Select,
  TextField,
  Typography,
  Button,
} from "@mui/material";
import { styled } from "@mui/material/styles";

export const Container = styled(Box)({
  borderRadius: 2,
  padding: "20px",
  margin: "auto",
});

export const TextFieldStyled = styled(TextField)({
  "& label.Mui-focused": {
    color: "#bb1f2a",
  },
});

export const SelectStyled = styled(Select)({
  padding: "2px 4px",
  border: "1px solid #ccc",
  ".MuiOutlinedInput-notchedOutline": {
    border: "none",
  },
  ".MuiSelect-select": {
    padding: "13px 0px",
    fontSize: "14px",
    color: "#333",
    display: "flex",
    alignItems: "center",
  },
});

export const Flag = styled("img")({
  width: "23px",
  height: "23px",
  marginRight: "4px",
});

export const CheckboxStyled = styled(Checkbox)({
  padding: "0px",
  "&.Mui-checked": {
    color: "#bb1f2a",
  },
});

export const TermsText = styled(Typography)({
  fontSize: "16px",
  cursor: "pointer",
  color: "#687188",
  display: "flex",
});

export const ButtonStyled = styled(Button)({
  padding: "12px 32px",
  backgroundColor: "#bb1f2a",
  color: "white",
  textTransform: "none",
  letterSpacing: 1,
});

export const LoginText = styled(Typography)({
  cursor: "pointer",
  color: "#bb1f2a",
  fontWeight: "bold",
  fontSize: "14px",
});
