"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  Button,
  Divider,
} from "@mui/material";
import Dashboard from "@/components/dashboard/Dashboard";
import orderServiceApi from "@/utils/services/oderServices";
import moment from "moment";
import COLORS from "@/utils/colors";
import {
  BreadCumContainer,
  BreadCumHeader,
  DashTitle,
  StyledHeading,
} from "@/components/styles";
import BreadcrumbsComponent from "@/components/BreadcrumbsComponent";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { getOrderStatusColor } from "@/utils/tagsColor";

const styles = {
  container: {
    minHeight: "100vh",
    boxShadow: "0 0 10px rgb(0 0 0 / 20%)",
  },
  headerBox: {
    bgcolor: "#f7f8fb",
  },
  headerContent: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerText: {
    color: "#292b2c",
    fontWeight: 600,
    fontSize: { sm: "24px", xs: "16px" },
  },
  breadcrumb: {
    color: "#292b2c",
    fontWeight: 600,
    fontSize: { sm: "24px", xs: "16px" },
  },
  sidebar: {
    bgcolor: "white",
    boxShadow: "0 0 10px rgb(0 0 0 / 20%)",
  },
  contentBox: {
    bgcolor: "white",
    // p: 3,
    borderRadius: 1,
    boxShadow: "0 0 10px rgb(0 0 0 / 20%)",
  },
  contentText: {
    color: "#292b2c",
    textTransform: "capitalize",
    fontWeight: 600,
    fontSize: { sm: "26px", xs: "16px" },
    px: 2,
  },
  tableCell: {
    fontWeight: 600,
    padding: "0px !important",
    fontSize: { sm: "16px", xs: "12px" },
  },
  button: {
    color: "white",
    height: "35px",
    borderRadius: "4px",
    backgroundColor: "#bb1f2a",
  },
  tableRowNoBorder: {
    borderBottom: "none",
  },
  tableContainer: {
    backgroundColor: "white",
    p: 1.3,
    borderRadius: 1,
    boxShadow: "1px 1px 5px #e8e0e0",
  },
  tableCellAlignEnd: {
    display: "flex",
    justifyContent: "flex-end",
    color: COLORS.grey,
    fontSize: { sm: "16px", xs: "11px" },
  },
};

const OderHistory = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const t = useTranslations();
  const router = useRouter();

  const getOderHistory = async () => {
    try {
      setLoading(true);
      const response = await orderServiceApi.getOrders();
      if (response && response.status === 200) {
        setData(response?.data);
      }
    } catch (error) {
      console.log(error, " error in oder history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getOderHistory();
  }, []);

  return (
    <div>
      <BreadCumContainer>
        <Container>
          <BreadCumHeader>
            <StyledHeading>{t("order_history")}</StyledHeading>
            <BreadcrumbsComponent
              pathSegments={[
                { link: "/", text: t("home") },
                { text: t("order_history"), link: "" },
              ]}
            />
          </BreadCumHeader>
        </Container>
      </BreadCumContainer>
      <Container sx={{ mt: 4, overflow: "hidden" }}>
        <Grid container spacing={2} mt={"10px"} mb={"50px"}>
          {/* Sidebar */}
          <Grid
            size={{
              xs: 12,
              sm: 3,
            }}
          >
            <Box sx={styles.sidebar}>
              <Dashboard selectItem={2} />
            </Box>
          </Grid>

          {/* Main Content */}
          <Grid
            sx={{ mb: { sm: 0, xs: 5 } }}
            size={{
              xs: 12,
              sm: 9,
            }}
          >
            <Box sx={styles.contentBox}>
              <DashTitle sx={{ px: 2, pt: 1 }}>{t("order_history")}</DashTitle>
              <hr className=" text-gray-300 mt-2" />

              <Grid container spacing={2} pb={2} px={3} pt={2}>
                {data?.length > 0
                  ? data?.map((item) => (
                      <Grid
                        key={item?.id}
                        size={{
                          xs: 12,
                          sm: 6,
                        }}
                      >
                        <Box sx={styles.tableContainer}>
                          <TableContainer>
                            <Table style={{ minHeight: "unset !important" }}>
                              <TableBody
                                style={{
                                  padding: 0,
                                  justifyContent: "flex-start",
                                }}
                              >
                                <TableRow
                                  sx={{
                                    padding: "0px",
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                  }}
                                >
                                  <Typography sx={styles.tableCell}>
                                    <Typography
                                      variant="body1"
                                      sx={{
                                        fontWeight: "bold",
                                        color: COLORS.primary,
                                      }}
                                    >
                                      {item?.id}
                                    </Typography>
                                    <Typography
                                      sx={{
                                        ...styles.tableCell,
                                        ...styles.tableRowNoBorder,
                                      }}
                                    >
                                      {moment(item?.order_date).format(
                                        "MMM DD, YYYY",
                                      )}
                                    </Typography>
                                  </Typography>
                                  <Button
                                    variant="contained"
                                    onClick={() =>
                                      router.push(`/order-details/${item?.id}`)
                                    }
                                    sx={{
                                      backgroundColor: "#bb1f2a",
                                      color: "#fff",
                                      fontSize: "12px",
                                      padding: "6px 12px !important",
                                      height: "35px",
                                      borderRadius: "2px",
                                      textTransform: "none",
                                      "&:hover": {
                                        backgroundColor: "#a10f1f",
                                      },
                                    }}
                                  >
                                    {t("view")}
                                  </Button>
                                </TableRow>
                                <Divider
                                  sx={{ border: "1px solid #dee2e6", my: 1 }}
                                />
                                <TableRow
                                  sx={{
                                    display: "flex",
                                    alignItem: "center",
                                    justifyContent: "space-between",
                                    my: 0.5,
                                  }}
                                >
                                  <Typography
                                    sx={{
                                      ...styles.tableCell,
                                      ...styles.tableRowNoBorder,
                                    }}
                                  >
                                      {t("order_status")}
                                  </Typography>
                                  <Typography
                                    sx={{
                                      ...styles.tableRowNoBorder,
                                      ...styles.tableCellAlignEnd,
                                      color: getOrderStatusColor(
                                        item?.order_status,
                                      )?.color,
                                      background: getOrderStatusColor(
                                        item?.order_status,
                                      )?.backgroundColor,
                                      padding: "1px 8px",
                                      borderRadius: "4px",
                                      fontSize: "14px",
                                      fontWeight: "600",
                                    }}
                                  >
                                    {item?.status}
                                  </Typography>
                                </TableRow>
                                <TableRow
                                  sx={{
                                    display: "flex",
                                    alignItem: "center",
                                    justifyContent: "space-between",
                                    my: 0.5,
                                  }}
                                >
                                  <Typography
                                    sx={{
                                      ...styles.tableCell,
                                      ...styles.tableRowNoBorder,
                                    }}
                                  >
                                      {t("items")}
                                  </Typography>
                                  <Typography
                                    sx={{
                                      ...styles.tableRowNoBorder,
                                      ...styles.tableCellAlignEnd,
                                    }}
                                  >
                                    {item?.item_count}   {t("items")}
                                  </Typography>
                                </TableRow>
                                <TableRow
                                  sx={{
                                    display: "flex",
                                    alignItem: "center",
                                    justifyContent: "space-between",
                                    my: 0.5,
                                  }}
                                >
                                  <Typography
                                    sx={{
                                      ...styles.tableCell,
                                      ...styles.tableRowNoBorder,
                                    }}
                                  >
                                      {t("price")}
                                  </Typography>
                                  <Typography
                                    sx={{
                                      ...styles.tableRowNoBorder,
                                      ...styles.tableCellAlignEnd,
                                    }}
                                  >
                                    {item?.total}
                                  </Typography>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </Box>
                      </Grid>
                    ))
                  : !loading && (
                      <Grid size={12}>
                        <Typography
                          variant="h6"
                          sx={{
                            textAlign: "center",
                            color: COLORS.primary,
                            mt: 2,
                          }}
                        >
                            {t("no_order_found")}
                        </Typography>
                      </Grid>
                    )}
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default OderHistory;
