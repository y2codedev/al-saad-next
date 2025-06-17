import React, { useState, useCallback, useEffect } from "react";
import {
  Box,
  IconButton,
  TextField,
  DialogContent,
  DialogActions,
  Slide,
  Typography,
  Container,
  CircularProgress,
  Dialog,
  DialogTitle,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { Search, Close, LocalActivityOutlined } from "@mui/icons-material";
import { searchApi } from "@/utils/services/searchService";
import useDebounce from "@/hooks/useDebounce";
import ResultList from "./SearchFliter/ResultList";
import useSearchStore from "@/store/useSearchStore";
import { SearchInputWrapper, StyledDialog } from "./styles";
import { useSettingsStore } from "@/store/useSettingsStore";
import COLORS from "@/utils/colors";
import { useTranslations } from "next-intl";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction={"left"} ref={ref} {...props} />;
});

const SearchBar = ({ handleClose, openSearch }) => {
  const { searchData, setSearchData } = useSearchStore();
  const { selectedCountry } = useSettingsStore();
  const [searchText, setSearchText] = useState("");
  const debouncedSearchText = useDebounce(searchText, 300);
  const [loading, setLoading] = useState(false);
  const t = useTranslations();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const getData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await searchApi.getSearchData(debouncedSearchText);
      setSearchData(response?.data);
    } catch (err) {
      console.error("Error fetching search data:", err);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearchText]);

  useEffect(() => {
    if (debouncedSearchText.trim().length >= 1) {
      getData();
    } else {
      setSearchData([]);
    }
  }, [debouncedSearchText, getData, setSearchData]);

  const handleClick = () => {
    setSearchText("");
    setSearchData([]);
    handleClose();
  };

  const handleChange = (e) => {
    setSearchText(e.target.value);
  };

  return (
    <Dialog
      disableScrollLock
      open={openSearch}
      onClose={handleClick}
      fullWidth
      maxWidth="lg"
      fullScreen={fullScreen}
      slots={{ transition: Transition }}
      transitionDuration={400}
      slotProps={{
        transition: {
          direction: "right",
        },
      }}
      keepMounted
      sx={{
        width: "100%",
        background: "transparent",
        "& .MuiDialog-paper": {
          backgroundColor: "transparent",
          boxShadow: "none",
        },
        ".MuiBackdrop-root": {
          backgroundColor: "rgba(0,0,0,0.8)",
        },
      }}
    >
      <DialogTitle>
        <IconButton
          onClick={handleClick}
          sx={{
            position: "absolute",
            top: { xs: 2, sm: 45 },
            right: { xs: 1, sm: "2%" },
          }}
        >
          <Close sx={{ color: "#fff" }} />
        </IconButton>
      </DialogTitle>

      <DialogContent
        sx={{
          mt: 2,
          overflow: "hidden",
          height: "calc(100vh - 100px)",
          mb: 5,
          padding: "20px 15px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            mt: 5,
          }}
        >
          <SearchInputWrapper>
            <TextField
              fullWidth
              variant="standard"
              placeholder={t("search")}
              value={searchText}
              onChange={handleChange}
              InputProps={{
                disableUnderline: true,
                sx: {
                  color: "#fff",
                  "::placeholder": { color: "#ffffff" },
                  fontSize: "18px",
                },
              }}
            />
            {loading && (
              <CircularProgress sx={{ color: COLORS.white }} size={20} />
            )}
            <IconButton>
              <Search sx={{ color: "#fff" }} />
            </IconButton>
          </SearchInputWrapper>

          {Array.isArray(searchData) && searchData?.length > 0 ? (
            <ResultList
              data={searchData}
              handleClose={handleClose}
              cur={selectedCountry?.currency_code || ""}
            />
          ) : (
            searchText.length > 0 &&
            !loading && (
              <Typography sx={{ color: "#fff", mt: 2 }}>
                No results found.
              </Typography>
            )
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default SearchBar;
