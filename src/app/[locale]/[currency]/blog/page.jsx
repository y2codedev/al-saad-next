"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSearchParams, usePathname } from "next/navigation";
import {
  Box,
  Container,
  Grid,
  Pagination,
  PaginationItem,
} from "@mui/material";
import BlogCards from "@/components/blog/BlogCards";
import BlogSideBar from "@/components/blog/BlogSideBar";
import BlogSideBarShimmer from "@/components/skeleton/BlogSideBarShimmer";
import BlogCardShimmer from "@/components/skeleton/BlogCardShimmer";
import BreadcrumbsComponent from "@/components/BreadcrumbsComponent";
import {
  BreadCumContainer,
  BreadCumHeader,
  StyledHeading,
} from "@/components/styles";
import { useTranslations } from "next-intl";
import { blogApi } from "@/utils/services/blogServices";
import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";

const page = () => {
  const params = useParams();
  const [pageNumber, setPageNumber] = useState(1);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const t = useTranslations();

  const tag = searchParams.get("tag") || undefined;
  const dates = searchParams.get("dates") || undefined;
  const page = searchParams.get("page") ? Number(searchParams.get("page")) : 1;
  const keyword = searchParams.get("keyword") || "";

  const fetchHomeData = async (page) => {
    setLoading(true);
    try {
      const reqBody = {
        keyword: keyword,
        tag,
        dates,
        page,
      };

      const response = await blogApi.getBlog(reqBody);
      if (response && response.status === 200) {
        setData(response.data);
        setTotalPages(
          Math.ceil(response.data.total_page / response.data.per_page),
        );
      }
    } catch (error) {
      console.error("Error fetching blog data:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const currentPage = Number(page) || 1;
    setPageNumber(currentPage);
    fetchHomeData(currentPage);
  }, [pathname, page, tag, dates, keyword]);

  const handleChangePage = (event, newPage) => {
    router.push(
      `?page=${newPage}${tag ? `&tag=${tag}` : ""}${dates ? `&dates=${dates}` : ""}`,
    );
  };

  return (
    <Box sx={{ minHeight: "100vh" }}>
      <BreadCumContainer>
        <Container>
          <BreadCumHeader>
            <StyledHeading>{t("blog")}</StyledHeading>
            <BreadcrumbsComponent
              pathSegments={[
                { link: "/", text: t("home") },
                { text: t("blog"), link: "/blog" },
              ]}
            />
          </BreadCumHeader>
        </Container>
      </BreadCumContainer>
      <Container maxWidth="lg" sx={{ py: 5, px: 1, overflow: "hidden" }}>
        <Grid
          container
          spacing={4}
          sx={{
            display: "flex",
            flexDirection: { xs: "column-reverse", sm: "row" },
          }}
        >
          <Grid
            size={{
              xs: 12,
              md: 3,
            }}
          >
            {loading ? <BlogSideBarShimmer /> : <BlogSideBar data={data} />}
          </Grid>
          <Grid
            size={{
              xs: 12,
              md: 9,
            }}
          >
            <Grid container spacing={4}>
              {loading
                ? Array.from({ length: 9 }).map((_, index) => (
                    <Grid
                      key={index}
                      size={{
                        xs: 12,
                        sm: 6,
                        md: 4,
                      }}
                    >
                      <BlogCardShimmer />
                    </Grid>
                  ))
                : data?.blogs?.map((blog) => (
                    <Grid
                      key={blog?.id}
                      size={{
                        xs: 12,
                        sm: 6,
                        md: 4,
                      }}
                    >
                      <BlogCards blog={blog} loading={loading} />
                    </Grid>
                  ))}
            </Grid>
          </Grid>
        </Grid>
        {totalPages > 1 && (
          <Box display="flex" justifyContent="center" my={4}>
            <Pagination
              count={totalPages}
              page={pageNumber}
              onChange={handleChangePage}
              shape="rounded"
              size="small"
              variant="outlined"
              renderItem={(item) => (
                <PaginationItem
                  components={{
                    previous: (props) => (
                      <KeyboardArrowLeft
                        {...props}
                        sx={{
                          transform:
                            params.locale === "ar" ? "rotate(180deg)" : "none",
                        }}
                      />
                    ),
                    next: (props) => (
                      <KeyboardArrowRight
                        {...props}
                        sx={{
                          transform:
                            params.locale === "ar" ? "rotate(180deg)" : "none",
                        }}
                      />
                    ),
                  }}
                  {...item}
                />
              )}
              sx={{
                "& .MuiPaginationItem-root": {
                  "&.Mui-selected": {
                    backgroundColor: "#bb1f2a",
                    color: "#fff",
                    "&:hover": { backgroundColor: "#a91c26" },
                  },
                },
              }}
            />
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default page;
