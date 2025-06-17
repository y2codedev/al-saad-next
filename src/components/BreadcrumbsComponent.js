import React from "react";
import { Link } from "../i18n/navigation";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { useParams } from "next/navigation";

const BreadcrumbsComponent = ({ pathSegments }) => {
  const params = useParams();

  return (
    <Breadcrumbs
      sx={{ cursor: "pointer", fontSize: "14px" }}
      separator={<NavigateNextIcon fontSize="small" />}
      aria-label="breadcrumb"
    >
      {pathSegments?.map((item, index) => {
        const isLast = index === pathSegments?.length - 1;
        return isLast ? (
          <span
            key={index}
            style={{
              color: "#6c757d",
              textTransform: "capitalize",
              cursor: "not-allowed",
            }}
          >
            {item.text}
          </span>
        ) : (
          <Link
            locale={params.locale}
            key={index}
            href={item.link == "" ? "" : item.link}
            className="breadcrumbs-hover"
            style={{
              color: "#292b2c",
              textDecoration: "none",
              textTransform: "capitalize",
            }}
          >
            {item.text}
          </Link>
        );
      })}
    </Breadcrumbs>
  );
};

export default BreadcrumbsComponent;
