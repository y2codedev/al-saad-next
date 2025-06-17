import { styled } from "@mui/material/styles";
import {
  Box,
  Typography,
  Container,
  Chip,
  Card,
  CardMedia,
  CardContent,
  IconButton,
  Button,
  TextField,
  Grid,
  Dialog,
} from "@mui/material";
import { Link } from "../i18n/navigation";
import COLORS from "../utils/colors";

export const StyledContainer = styled(Container)({
  padding: 0,
});

export const CarouselWrapper = styled(Box)(({ marginTop }) => ({
  width: "100%",
  position: "relative",
  marginTop: marginTop || "0px",
}));

export const StyledLink = styled(Link)({
  display: "flex",
  justifyContent: "center",
  width: "100%",
  height: "100%",
  textDecoration: "none",
});

export const ImageWrapper = styled(Box)({
  position: "relative",
  display: "flex",
  alignItems: "center",
  flexDirection: "column",
  cursor: "pointer",
});

export const StyledImage = styled("img")(
  ({
    theme,
    width,
    height,
    borderRadius,
    padding,
    minHeight,
    maxHeight,
    border,
  }) => ({
    objectFit: "cover",
    cursor: "pointer",
    overflow: "hidden",
    borderRadius: borderRadius || "0px",
    ...(minHeight && { minHeight }),
    ...(maxHeight && { maxHeight }),
    padding: padding || 0,
    transition: "0.5s ease-in-out",
    "&:hover": border && { border: "3px solid  #bb1f2a" },
    [theme.breakpoints.down("md")]: {
      width: width || "70px",
      height: height || "70px",
    },
    [theme.breakpoints.up("md")]: {
      width: width || "97px",
      height: height || "97px",
    },
  }),
);

export const ContainerBox = styled(Box)`
  position: relative;
  display: block;
  width: 100%;
  height: auto;
  &:hover .overlay {
    opacity: 1;
  }
`;

export const Overlay = styled(Box)`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100%;
  width: 100%;
  opacity: 0;
  transition: 0.5s ease-in-out;
`;

export const StyledTypography = styled(Typography)({
  fontFamily: "Poppins, sans-serif",
  color: "#292b2c",
  textAlign: "center",
  textTransform: "capitalize",
  fontWeight: 500,
  fontSize: "14px",
  marginTop: "10px",
  cursor: "pointer",
  display: "-webkit-box",
  overflow: "hidden",
  WebkitBoxOrient: "vertical",
  WebkitLineClamp: 2,
  wordBreak: "break-all",
  whiteSpace: "normal",
  textOverflow: "ellipsis",
  "&:hover": {
    color: "#bb1f2a",
  },
});

export const StyledHeading = styled(Typography)({
  fontWeight: 600,
  flexWrap: "wrap",
  textTransform: "capitalize",
  textAlign: "start",
  // marginLeft: "8px",
  fontSize: "24px",
  "@media (max-width: 600px)": {
    fontSize: "18px",
  },
});

export const NewChipStyle = styled(Chip)({
  position: "absolute",
  height: "24px",
  width: "52px",
  top: 10,
  right: 10,
  backgroundColor: "#bb1f2a",
  color: "#fff",
  borderRadius: "0px",
});

export const CardWrapper = styled(Card)({
  height: "100%",
  overflow: "hidden",
  boxShadow: "0 0 7px rgb(0 0 0 / 10%)",
  cursor: "pointer",
  margin: "4px",
});

export const HeaderContainer = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(1),
  marginBottom: theme.spacing(1),
  cursor: "pointer",
  flexWrap: "wrap",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: theme.spacing(0),
}));

export const ViewTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  fontSize: "14px",
  [theme.breakpoints.up("sm")]: {
    fontSize: "18px",
  },
}));

export const ViewAllLink = styled(Link)(({ theme }) => ({
  textDecoration: "none",
  display: "flex",
  alignItems: "center",
  color: "#bb1f2a",
  fontSize: "1rem",
  cursor: "pointer",
}));

export const ViewText = styled(Typography)(({ theme }) => ({
  color: "#bb1f2a",
  cursor: "pointer",
  fontSize: "14px",
  [theme.breakpoints.up("sm")]: {
    fontSize: "16px",
  },
}));

export const FlashSaleImg = styled(CardMedia)(({ theme }) => ({
  position: "absolute",
  height: "50px",
  width: "auto",
  bottom: 5,
  right: 20,
  objectFit: "cover",
  zIndex: 9999,
}));

export const StyledCardContent = styled(CardContent)(({ theme }) => ({
  padding: theme.spacing(1, 1),
  marginBottom: theme.spacing(0),
}));

export const ProductTitle = styled(Typography)(
  ({ fontSize, fontWeight, WebkitLineClamp }) => ({
    color: "#292b2c",
    fontWeight: fontWeight || 600,
    fontSize: fontSize || "1rem",
    alignSelf: "flex-start",
    display: "-webkit-box",
    overflow: "hidden",
    WebkitBoxOrient: "vertical",
    WebkitLineClamp: WebkitLineClamp || 2,
    wordBreak: "break-all",
    whiteSpace: "normal",
    textOverflow: "ellipsis",
    transition: "color 0.3s ease",
    "&:hover": {
      color: "#bb1f2a",
    },
  }),
);

export const PriceContainer = styled(Box)({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: 8,
  marginTop: 8,
});

export const WishlistButton = styled(IconButton)(({ isInWishlist, theme }) => ({
  padding: "8px",
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(0.5),
  },
  backgroundColor: isInWishlist ? "#bb1f2a" : "#fff",
  transition: "background-color 0.3s ease",
  "&:hover": {
    backgroundColor: "#bb1f2a",
    color: "#fff !important",
    "& .MuiSvgIcon-root": {
      fill: "#fff",
    },
  },
  "& .MuiSvgIcon-root": {
    fill: isInWishlist ? "#fff" : "#292b2c",
    transition: "fill 0.3s ease",
  },
}));

export const TimerBox = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(0.5),
  [theme.breakpoints.up("sm")]: {
    gap: theme.spacing(1),
  },
}));

export const TimerItem = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  backgroundColor: "#bb1f2a",
  paddingInline: theme.spacing(0.5),
  paddingBlock: theme.spacing(0.5),
  fontSize: "12px",
  color: "#fff",
  [theme.breakpoints.up("sm")]: {
    fontSize: "14px",
    paddingInline: theme.spacing(0.75),
  },
  [theme.breakpoints.up("md")]: {
    paddingInline: theme.spacing(1),
  },
}));

export const BlogDescription = styled(Typography)(({ theme, fontSize }) => ({
  display: "-webkit-box",
  overflow: "hidden",
  WebkitBoxOrient: "vertical",
  WebkitLineClamp: 4,
  wordBreak: "break-word",
  whiteSpace: "normal",
  textOverflow: "ellipsis",
  lineHeight: "28px",
  color: "#687188",
  fontSize: fontSize || "14px",
  [theme.breakpoints.up("sm")]: {
    fontSize: fontSize || "16px",
  },
}));

export const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  fontSize: "16px",
  marginBottom: theme.spacing(2),
  textAlign: "left",
  [theme.breakpoints.up("sm")]: {
    fontSize: "24px",
    textAlign: "center",
  },
}));

export const BlogTopDes = styled(Typography)(({ theme }) => ({
  color: "#687188",
  marginBottom: theme.spacing(4),
  fontSize: "14px",
  textAlign: "left",
  [theme.breakpoints.up("sm")]: {
    fontSize: "16px",
    textAlign: "center",
  },
}));

export const NewsletterWrapper = styled(Box)(({ theme }) => ({
  backgroundColor: "#bb1f2a",
  padding: theme.spacing(2.5, 0),
  color: "white",
}));

export const StyledButtonNewLatter = styled(Button)({
  backgroundColor: COLORS.secondryBtn,
  color: "white",
  fontWeight: "bold",
  borderRadius: 0,
  padding: "8px 8px",
  "&:hover": { backgroundColor: COLORS.secondryBtn },
  height: 50,
  width: "150px",
  border: `1px solid ${COLORS.secondryBtn}`,
});

export const FormWrapperNewLatter = styled("form")(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  width: "100%",
}));

export const StyledTextFieldNewLatter = styled(TextField)({
  flex: 1,
  backgroundColor: "#fff",
  borderRadius: 0,
  "& input": { padding: "4px 6px" },
  height: 50,
  "& .MuiOutlinedInput-root": {
    borderRadius: 0,
  },
  color: COLORS.secondryBtn,
});

export const CategoryContainer = styled(Box)({
  position: "relative",
  borderRadius: "6px",
  cursor: "pointer",
  overflow: "hidden",
  transition: "transform 0.3s ease",
  overlay: "auto",
  "&:hover": { opacity: 0.8 },
});

export const CategoryTextOverlay = styled(Box)({
  position: "absolute",
  width: "100%",
  backgroundColor: "rgba(0, 0, 0, 0.4)",
  textAlign: "center",
  fontSize: "20px",
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  color: "white",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "20px",
  transition: "all .3s ease-in-out",
  textTransform: "capitalize",
  fontWeight: 500,
});

export const BreadCumHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  flexWrap: "wrap",
  padding: "30px 0",
}));

export const Tag = styled(Typography)(({ theme }) => ({
  fontSize: "14px",
  backgroundColor: "#f7f7f7",
  padding: "8px",
  color: "#333",
  textTransform: "capitalize",
  cursor: "pointer",
  ":hover": { backgroundColor: "#bb1f2a", color: "#fff" },
}));

export const BreadCumContainer = styled(Box)({
  backgroundColor: "#f7f8fb",
});

export const CategoryTitle = styled(Box)`
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  background-color: white;
  border-radius: 6px;
  padding: 6px 12px;
  box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.2);
  text-align: center;
`;

export const CategoryCard = styled(Box)`
  box-shadow: 3px 3px 10px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.3s ease;
  overflow: hidden;
  position: relative;
  width: 100%;
  &:hover {
    opacity: 0.8;
  }
`;

export const DisplayFlex = styled(Typography)(
  ({ justifyContent, gap, backgroundColor, padding, flexDirection }) => ({
    display: "flex",
    padding: padding || "0px",
    gap: gap || 0,
    backgroundColor: backgroundColor || "#fff",
    justifyContent: justifyContent || "start",
    alignItems: "center",
    flexDirection: flexDirection || "",
  }),
);

export const BlogSpan = styled(Typography)(({ backgroundColor }) => ({
  backgroundColor: backgroundColor || "#1877f2",
  padding: "4px 8px",
  borderRadius: "4px",
  color: "#fff",
}));

export const BlogGrid = styled(Grid)(({ theme }) => ({
  // padding: "4px 8px",
  borderRadius: "4px",
  color: "#fff",
}));

export const ContactBox = styled(Box)({
  width: "80px",
  height: "80px",
  borderRadius: "50%",
  border: "1px solid #bb1f2a",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  transition: "all 0.3s ease",
  margin: "8px",
  color: "#bb1f2a",
});

export const SpinLoader = styled(Box)({
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1,
});

export const ImagePikerMain = styled(Box)({
  position: "absolute",
  top: 0,
  left: 0,
  width: "95%",
  height: "100%",
  alignItems: "center",
});

export const ImagePikerBox = styled(Box)({
  cursor: "pointer",
  zIndex: 1,
  width: "35px",
  height: "35px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: "50%",
});

export const VisibilityBox = styled(Box)({
  cursor: "pointer",
  zIndex: 1,
  width: "35px",
  height: "35px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "#fff",
  borderRadius: "50%",
  boxShadow: "0 0 7px rgb(0 0 0 / 10%)",
});

export const ClickClose = styled(Box)({
  width: "20px",
  height: "20px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "rgba(255, 255, 255, 0.8)",
  borderRadius: "50%",
  boxShadow: "0 0 7px rgb(0 0 0 / 10%)",
  cursor: "pointer",
});

export const DashBox = styled(Box)({
  backgroundColor: "#fff",
  // padding: "24px",
  borderRadius: " 4px",
  boxShadow: "0 0 7px rgb(0 0 0 / 10%)",
});

export const DashTitle = styled(Typography)`
  color: #292b2c;
  text-transform: capitalize;
  font-weight: 600;
  font-size: 15px;
  @media (min-width: 600px) {
    font-size: 24px;
  }
`;

export const FadeBox = styled(Box)({
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  bgcolor: "background.paper",
  boxShadow: "0 0 7px rgb(0 0 0 / 10%)",
  px: 2,
  py: 1,
  outline: 0,
  borderRadius: 0,
  overflowY: "auto",
  display: "flex",
  flexDirection: "column",
});

// Payment style here

export const PaymentMethodContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: "24px 16px",
  borderRadius: "12px",
  cursor: "pointer",
  marginBottom: theme.spacing(2),
  background: COLORS.white,
}));

export const PaymentMethodContent = styled(Box)(() => ({
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "space-between",
  width: "100%",
}));

export const PaymentMethodText = styled(Box)(({ theme }) => ({
  // textAlign: 'center',
  alignItems: "flex-start",
  display: "flex",
  [theme.breakpoints.up("sm")]: {
    textAlign: "left",
  },
}));

export const PaymentMethodTitle = styled(Typography)(({ theme }) => ({
  fontSize: "16px",
  fontWeight: "500",
  marginBottom: theme.spacing(1),
}));

export const PaymentMethodDescription = styled(Typography)(() => ({
  fontSize: "16px",
  color: "#86939e",
  lineHeight: "28px",
}));

export const RadioButton = styled(Box)(({ theme }) => ({
  paddingLeft: theme.spacing(2),
}));

export const PhotoTitle = styled(Typography)(() => ({
  color: "#292b2c",
  fontSize: "15px",
  fontWeight: "600",
}));

export const StyledDialog = styled(Dialog)(({ theme }) => ({
  overflow: "hidden",
  "& .MuiDialog-paper": {
    backgroundColor: "transparent",
    boxShadow: "none",
  },
  ".MuiBackdrop-root": {
    backgroundColor: "rgba(0,0,0,0.8)",
  },
}));

export const SearchInputWrapper = styled(Box)({
  display: "flex",
  alignItems: "center",
  width: "100%",
  borderBottom: "2px solid #fff",
});

export const SuggestionBox = styled(Box)({
  marginTop: "8px",
  width: "100%",
  backgroundColor: "#fff",
  height: "500px",
  overflowY: "auto",
  borderRadius: "4px",
  boxShadow: "0 0 7px rgb(0 0 0 / 10%)",
});

export const SuggestionItem = styled(Typography)({
  padding: "8px 16px",
  cursor: "pointer",
  "&:hover": {
    backgroundColor: "#f0f0f0",
  },
});
