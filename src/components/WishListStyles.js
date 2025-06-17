import { styled } from "@mui/material/styles";
import {
  Card,
  CardMedia,
  CardContent,
  Button,
  Typography,
} from "@mui/material";

export const StyledCard = styled(Card)(({ theme }) => ({
  marginBottom: "16px",
  boxShadow: "0 0 7px rgb(0 0 0 / 10%)",
  cursor: "pointer",
  marginLeft: theme.spacing(1),
  marginRight: theme.spacing(1),
  [theme.breakpoints.down("sm")]: {
    marginLeft: theme.spacing(0.2),
    marginRight: theme.spacing(0.2),
  },
}));

export const StyledCardMedia = styled(CardMedia)({
  // minHeight: { sm: "250px", xs: "150px" },
  // maxHeight: { sm: "400px", xs: "176px" },
});

export const StyledCardContent = styled(CardContent)({
  padding: "8px",
});

export const StyledButton = styled(Button)(({ theme, height }) => ({
  backgroundColor: "#bb1f2a",
  height: height || "100%",
  color: theme.palette.common.white,
  padding: "0px 9px",
  borderRadius: "3px",
  textTransform: "none",
}));

export const DeleteIconWrapper = styled(Typography)(({ theme }) => ({
  position: "absolute",
  top: "10px",
  right: "10px",
  backgroundColor: "#bb1f2a",
  color: theme.palette.common.white,
  padding: "5px",
  borderRadius: "4px",
  cursor: "pointer",
  ":hover": {
    backgroundColor: "red",
  },
}));
