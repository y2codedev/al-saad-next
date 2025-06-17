"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import Dashboard from "@/components/dashboard/Dashboard";
import { RiDeleteBin5Line } from "react-icons/ri";
import { MdEdit } from "react-icons/md";
import { shippingApi } from "@/utils/services/shippingApi";
import { showToast } from "@/utils/helper";
import ConfirmationPopup from "@/components/ConfirmationPopup";
import BreadcrumbsComponent from "@/components/BreadcrumbsComponent";
import {
  BreadCumContainer,
  BreadCumHeader,
  DashBox,
  DashTitle,
  StyledHeading,
} from "@/components/styles";
import COLORS from "@/utils/colors";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useParams } from "next/navigation";

const MyAddress = () => {
  const [deleteId, setDeleteId] = useState("");
  const [getAddress, setGetAddress] = useState([]);
  const [openPopup, setOpenPopup] = useState(false);
  const router = useRouter();
  const t = useTranslations();
  const { id } = useParams();

  const handleOpenDelete = (id) => {
    setDeleteId(id);
    setOpenPopup(true);
  };

  const handleCloseDelete = () => {
    setOpenPopup(false);
    setDeleteId("");
  };

  const handleConfirm = () => {
    setOpenPopup(false);
    deleteShippingAddress(deleteId);
  };

  const getShipping = async () => {
    try {
      const response = await shippingApi.getShippingAddress();
      if (response && response.status === 200) {
        setGetAddress(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getShipping();
  }, []);

  const deleteShippingAddress = async (id) => {
    try {
      const req = {
        shipping_address_id: id,
      };
      const response = await shippingApi.deleteShippingAddress(req);
      if (response && response.status === 200) {
        setGetAddress((prev) => prev?.filter((item) => item.id !== id));
        setDeleteId("");
        showToast("success", response.message);
      }
    } catch (error) {
      console.error("Error deleting address:", error);
    }
  };

  return (
    <div style={{ minHeight: "100vh" }}>
      <BreadCumContainer>
        <Container>
          <BreadCumHeader>
            <StyledHeading>{t("my_address")}</StyledHeading>
            <BreadcrumbsComponent
              pathSegments={[
                { link: "/", text: t("home") },
                { text: t("my_address"), link: "my-address" },
              ]}
            />
          </BreadCumHeader>
        </Container>
      </BreadCumContainer>
      <Container sx={{ mt: 4 }}>
        <Grid container spacing={2} mt={"10px"} mb={"50px"}>
          <Grid
            size={{
              xs: 12,
              sm: 3,
            }}
          >
            <Box sx={{ boxShadow: "0 0 10px rgb(0 0 0 / 20%)" }}>
              <Dashboard selectItem={3} />
            </Box>
          </Grid>

          <Grid
            sx={{ mb: 10 }}
            size={{
              xs: 12,
              sm: 9,
            }}
          >
            <DashBox>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <DashTitle sx={{ px: 2 }}>{t("my_address")}</DashTitle>
                <Button
                  onClick={() => router.push(`/add-address`)}
                  variant="contained"
                  sx={{
                    backgroundColor: COLORS.primary,
                    color: "#fff",
                    borderRadius: "2px",
                    mx: 2,
                    my: 1,
                  }}
                >
                  {t("add_address")}
                </Button>
              </Box>
              <hr className=" text-gray-300 mt-0" />

              {getAddress?.length > 0 ? (
                <TableContainer
                  sx={{ boxShadow: "0 0 10px rgb(0 0 0 / 20%)" }}
                  component={Paper}
                >
                  <Table sx={{ minWidth: 650 }} aria-label="address table">
                    <TableHead>
                      <TableRow>
                        <TableCell className="table-head">Country</TableCell>
                        <TableCell className="table-head">City</TableCell>
                        <TableCell className="table-head">Address</TableCell>
                        <TableCell className="table-head">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {getAddress?.map((item) => (
                        <TableRow key={item?.id}>
                          <TableCell className="table-data">
                            {item?.country}
                          </TableCell>
                          <TableCell className="table-data">
                            {item?.city}
                          </TableCell>
                          <TableCell className="table-data">
                            <Typography
                              className="table-data"
                              sx={{
                                display: "-webkit-box",
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                WebkitLineClamp: 2,
                                fontSize: "16px",
                              }}
                            >
                              {item?.address}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <Button
                                onClick={() =>
                                  router.push(`/address-update/${item?.id}`)
                                }
                                variant="contained"
                                sx={{
                                  backgroundColor: COLORS.primary,
                                  padding: "3px",
                                  borderRadius: "2px",
                                  height: "35px",
                                }}
                              >
                                <MdEdit size={16} />
                              </Button>
                              <Button
                                onClick={() => handleOpenDelete(item?.id)}
                                variant="contained"
                                sx={{
                                  backgroundColor: COLORS.primary,
                                  padding: "3px",
                                  borderRadius: "2px",
                                  height: "35px",
                                }}
                              >
                                <RiDeleteBin5Line size={16} />
                              </Button>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Typography
                  sx={{ textAlign: "center", p: 3, fontWeight: "600" }}
                >
                  No record found{" "}
                </Typography>
              )}
            </DashBox>

            <ConfirmationPopup
              open={openPopup}
              handleClose={handleCloseDelete}
              handleConfirm={handleConfirm}
              title={"Delete Address"}
              subtitle="Do you want to delete this item?"
            />
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default MyAddress;
