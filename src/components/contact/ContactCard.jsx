"use client";

import React from "react";
import { CardContent, Typography, Box } from "@mui/material";
import { ImMap2 } from "react-icons/im";
import { CardWrapper, ContactBox } from "@/components/styles";
import COLORS from "@/utils/colors";

const ContactCard = ({ location, selectedMapUrl }) => {
  return (
    <CardWrapper>
      <CardContent>
        <Box
          className="contact-card"
          display="flex"
          flexDirection="column"
          alignItems="center"
          sx={{
            cursor: "pointer",
            justifyContent: "center",
            "&:hover .contact-box": {
              backgroundColor: COLORS.primary,
              color: "#fff",
            },
            "&:hover .contact-icon": {
              color: "#fff",
            },
          }}
        >
          <ContactBox
            className="contact-box"
            sx={{
              backgroundColor:
                location?.map_url === selectedMapUrl ? COLORS.primary : "#fff",
              color:
                location?.map_url === selectedMapUrl ? "#fff" : COLORS.primary,
            }}
          >
            <ImMap2 className="contact-icon" size={30} />
          </ContactBox>
          <Typography
            sx={{ color: "#333", fontWeight: 600, textAlign: "center" }}
          >
            {location?.title}
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "#687188", lineHeight: "28px", textAlign: "center" }}
          >
            {location?.location}
          </Typography>
        </Box>
      </CardContent>
    </CardWrapper>
  );
};

export default ContactCard;
