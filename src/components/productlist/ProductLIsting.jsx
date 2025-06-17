"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { ProdictListingHeader } from "@/components/productlist/ProdictListingHeader";
import { homeApi } from "@/utils/services/homeServices";
import {
  Box,
  Container,
  FormControl,
  Grid,
  MenuItem,
  Select,
  Typography,
  Fade,
  Modal,
  IconButton,
  Backdrop,
} from "@mui/material";
import { PaginationComponent } from "@/components/productlist/PaginationComponent";
import { useParams, useSearchParams, usePathname } from "next/navigation";
import ProductListingSideBar from "@/components/productlist/ProductListingSideBar";
import { MdOutlineFilterAlt } from "react-icons/md";
import CloseIcon from "@mui/icons-material/Close";
import SidebarShimmer from "@/components/skeleton/SidebarShimmer";
import ProductShimmer from "@/components/skeleton/ProductShimmer";
import { FadeBox } from "../styles";
import { ProductGridToggle } from "./ProductGridToggle";
import { FilterTags } from "./FilterTags";
import { ProductListingContent } from "./ProductListingContent";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

const ProductListing = () => {
  const searchParams = useSearchParams();
  const t = useTranslations()
  const fetchRef = useRef(false);
  const [isChecked, setIsChecked] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pagination, setPagination] = useState(30);
  const [gridTogal, setGridTogal] = useState(true);
  const [selectedCatlist, setSelectedCatlist] = useState([]);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
  const [price, setPrice] = useState({ min: "", max: "" });
  const [sortOrder, setSortOrder] = useState("");
  const [showMore, setShowMore] = useState();
  const [brandShow, setBrandShow] = useState(false);
  const [styleShowMore, setStyleShowMore] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedColor, setSelectedColor] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [otherSelectedAttributes, setOtherSelectedAttributes] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [filterBrands, setFilterBrands] = useState([]);
  const [filterSizes, setFilterSizes] = useState([]);
  const [filterColors, setFilterColors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterLoading, setFilterLoading] = useState(false);
  const [newest, setNewest] = useState("new");
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter(Boolean);
  const category = pathSegments[2];

  const {
    slug: categoryId,
    productId: subcategoryId,
    locale: lng,
    params = [],
  } = useParams();
  const [type, id] = params;
  const router = useRouter();

  useEffect(() => {
    const initialParams = Object.fromEntries(searchParams.entries());
    if (initialParams.minPrice)
      setPrice((prev) => ({ ...prev, min: initialParams.minPrice }));
    if (initialParams.maxPrice)
      setPrice((prev) => ({ ...prev, max: initialParams.maxPrice }));
    if (initialParams.sort_by) setSortOrder(initialParams.sort_by);
    if (initialParams.pagination) setPagination(initialParams.pagination);
    if (initialParams.brand) {
      const brands = initialParams.brand
        .split(",")
        .map(Number)
        .filter((id) => !isNaN(id));
      setSelectedBrands(brands);
    }

    if (initialParams.sizes) {
      const sizes = initialParams.sizes
        .split(",")
        .map(Number)
        .filter((id) => !isNaN(id));
      setSelectedSizes(sizes);
    }

    if (initialParams?.category) {
      const category = initialParams?.category
        .split(",")
        .map(Number)
        .filter((id) => !isNaN(id));
      setSelectedCatlist(category);
    }

    if (initialParams.colors) {
      const colors = initialParams.colors
        .split(",")
        .map(Number)
        .filter((id) => !isNaN(id));
      setSelectedColor(colors);
    }

    if (initialParams.attributes_value_id) {
      const attributes = initialParams.attributes_value_id
        .split(",")
        .map(Number)
        .filter((id) => !isNaN(id));
      setOtherSelectedAttributes(attributes);
    }

    if (initialParams.page) setCurrentPage(Number(initialParams.page));
    if (initialParams.title) setSearchTerm(initialParams.search);
    if (initialParams.newest) setNewest(initialParams.newest);
    if (initialParams.filter_type)
      setIsChecked(Boolean(initialParams.filter_type));
  }, [searchParams]);

  const getRequestBody = () => {
    const params = new URLSearchParams(searchParams);
    const newRequestBody = {};

    let minPrice = parseInt(price.min || "0", 10);
    let maxPrice = parseInt(price.max || "0", 10);
    if (params.has("minPrice")) {
      minPrice = parseInt(params.get("minPrice") || "0", 10);
    }
    if (params.has("maxPrice")) {
      maxPrice = parseInt(params.get("maxPrice") || "0", 10);
    }
    newRequestBody.sale_high_price = maxPrice > 0 ? maxPrice : "";
    newRequestBody.sale_low_price = minPrice > 0 ? minPrice : "";

    params.forEach((value, key) => {
      if (key === "sort_by") {
        newRequestBody.sort_by = value;
      } else if (key === "page") {
        newRequestBody.page = value;
      } else if (key === "sizes") {
        newRequestBody.size_id = value.split(",").map(String);
      } else if (key === "colors") {
        newRequestBody.color_id = value.split(",").map(String);
      } else if (key === "brand") {
        newRequestBody.brand_id = value.split(",").map(String);
      } else if (key === "attributes_value_id") {
        newRequestBody.attributes_value_id = value.split(",").map(String);
      } else if (key === "category") {
        newRequestBody.category_ids = value.split(",").map(String);
      } else if (key === "title") {
        newRequestBody.title = value;
      } else if (key === "pagination") {
        newRequestBody.pagination = value;
      } else if (key === "filter_type") {
        newRequestBody.filter_type = value;
      }
    });

    return newRequestBody;
  };

  const handlePagination = (event) => {
    event.preventDefault();
    let updatedParams = new URLSearchParams(window.location.search);
    if (event.target.value != 30) {
      updatedParams.set("pagination", event.target.value);
    } else {
      updatedParams.delete("pagination");
    }
    updatedParams.delete("page");
    setCurrentPage(1);
    setPagination(event.target.value);

    const url = pathname + "?" + updatedParams.toString();
    router.push(url);
  };

  const toggleSelect = (id, selectAttribute) => {
    selectAttribute((prevSelected) => {
      let arrKey = new Set(prevSelected);
      if (!arrKey.has(id)) {
        arrKey.add(id);
      } else {
        arrKey.delete(id);
      }
      return Array.from(arrKey);
    });
  };

  const sortOptions = {
    price: { LTH: "Low to High", HTL: "High to Low" },
    age: { new: "New First", old: "Old First" },
    quantity: { MQ: "Most Quantity", LQ: "Less Quantity" },
  };

  const handleChangeSort = (event) => {
    setSortOrder(event.target.value);
  };

  const handlePriceChange = (event) => {
    setPrice({ ...price, [event.target.name]: event.target.value });
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleSwitchChange = (checked) => {
    setIsChecked(checked);
  };

  const handleNewestChange = (id) => {
    const params = new URLSearchParams(searchParams.toString());

    let newSet = new Set(selectedCatlist);

    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }

    const updatedList = Array.from(newSet);
    params.delete("page");
    if (updatedList.length > 0) {
      params.set("category", updatedList.join(","));
    } else {
      params.delete("category");
    }

    setSelectedCatlist(updatedList);

    const url = pathname + "?" + params.toString();
    router.push(url);
  };

  const applyFilters = (e) => {
    e.preventDefault();
    let updatedParams = new URLSearchParams();
    if (searchTerm) updatedParams.set("title", searchTerm);
    if (pagination !== 30) updatedParams.set("pagination", pagination);
    if (sortOrder.length > 0) updatedParams.set("sort_by", sortOrder);
    if (isChecked) updatedParams.set("filter_type", "AND");
    if (price.min) updatedParams.set("minPrice", price.min);
    if (price.max) updatedParams.set("maxPrice", price.max);
    if (selectedBrands.length > 0)
      updatedParams.set("brand", selectedBrands.join(","));
    if (selectedSizes.length > 0)
      updatedParams.set("sizes", selectedSizes.join(","));
    if (selectedColor.length > 0)
      updatedParams.set("colors", selectedColor.join(","));
    if (selectedCatlist.length > 0)
      updatedParams.set("category", selectedCatlist.join(","));

    if (otherSelectedAttributes.length > 0)
      updatedParams.set(
        "attributes_value_id",
        otherSelectedAttributes.join(","),
      );

    updatedParams.delete("page");
    const url = pathname + "?" + updatedParams.toString();
    router.push(url);
    handleCloseModal();
  };

  const handleReset = () => {
    setSelectedBrands([]);
    setSelectedSizes([]);
    setSelectedColor([]);
    setIsChecked(false);
    setPagination(30);
    setSortOrder("");
    setPrice({ min: "", max: "" });
    setShowMore([]);
    setBrandShow(false);
    setStyleShowMore([]);
    setOtherSelectedAttributes([]);
    setTotalPages(1);
    setCurrentPage(1);
    setNewest("new");
    setSelectedCatlist([]);
    setSearchTerm("");
    router.push(pathname);
  };

  const fetchData = async (page = currentPage) => {
    if (!fetchRef.current) {
      setLoading(true);
    }
    setError(null);
    try {
      const request = getRequestBody();
      const obj = {
        ...request,
        limit: request.pagination,
        title: searchTerm,
        type:
          type ||
          (category === "search"
            ? categoryId
            : ["brand", "category"].includes(category)
              ? category
              : ""),
        page: page || 1,
        filter_type: request.filter_type ? "AND" : "OR",
        category_ids: request.category_ids ?? [],
        ...(category !== "brand" &&
          type !== "display_banners" &&
          type != "flash_sale" &&
          type != "new" &&
          type != "recommended_product" && {
            category_id: categoryId,
            sub_category_id: subcategoryId ?? type,
          }),
        ...((type == "display_banners" || type == "flash_sale") && { id: id }),
        ...(category == "brand" && { brand_id: pathSegments[3] }),
      };



      const response = await homeApi.getProduct(obj);
      if (response && response.status === 200) {
        setData(response || []);
        const totalProducts = parseInt(response?.data?.total_products, 10) || 0;
        const pages = totalProducts
          ? Math.ceil(totalProducts / (obj?.limit || pagination))
          : 1;
        setTotalPages(pages);
      }
    } catch (err) {
      setError("Failed to load data. Please try again.");
      console.error("Error fetching data:", err);
    } finally {
      fetchRef.current = true;
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [searchParams, lng]);

  useEffect(() => {
    getFilter();
  }, [lng]);

  const handlePageChange = (event, value) => {
    event.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (value != 1) {
      params.set("page", value);
    } else {
      params.delete("page");
    }
    setCurrentPage(value);
    const url = pathname + "?" + params.toString();
    router.push(url);
  };

  function getFilterParams() {
    let req = {
      type:
        type ||
        (category === "search"
          ? categoryId
          : ["brand", "category"].includes(category)
            ? category
            : ""),
      ...(category !== "brand" &&
        type !== "display_banners" &&
        type != "flash_sale" &&
        type != "new" &&
        type != "recommended_product" && {
          category_id: categoryId,
          sub_category_id: subcategoryId ?? type,
        }),
      ...((type == "display_banners" || type == "flash_sale") && { id: id }),
      ...(category == "brand" && {
        brand_id: decodeURIComponent(pathSegments[3]),
      }),
    };
    return req;
  }

  const getFilter = async () => {
    try {
      setFilterLoading(true);
      const response = await homeApi.getFilter(getFilterParams());
      if (response && response.status === 200) {
        const { data } = response;
        const brands = [];
        const sizes = [];
        const colors = [];
        const remainingAttributes = [];
        data.forEach((attributeGroup) => {
          if (attributeGroup.attribute_id === "1") {
            brands.push(attributeGroup.item);
          } else if (attributeGroup.attribute_id === "3") {
            sizes.push(attributeGroup.item);
          } else if (attributeGroup.attribute_id === "2") {
            colors.push(attributeGroup.item);
          } else {
            remainingAttributes.push(attributeGroup);
          }
        });
        setFilterData(remainingAttributes);
        setFilterBrands(brands.flat());
        setFilterSizes(sizes.flat());
        setFilterColors(colors.flat());
      }
    } catch (error) {
      console.log("Error fetching home data:", error);
    } finally {
      setFilterLoading(false);
    }
  };

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <>
      <ProdictListingHeader />
      <Container>
        <Typography
          variant="body1"
          sx={{
            lineHeight: "28px",
            color: "#687188",
            mt: 3,
            fontSize: { xs: "12px", sm: "16px" },
          }}
        >
          {data?.heading}
        </Typography>
      </Container>
      <Container maxWidth="lg" sx={{ py: 5, px: 1, overflow: "hidden" }}>
        <Modal
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          open={isModalOpen}
          onClose={handleCloseModal}
          closeAfterTransition
          BackdropComponent={Backdrop}
        >
          <Fade in={isModalOpen}>
            <FadeBox
              sx={{
                backgroundColor: "#fff",
                borderRadius: "0px",
                maxHeight: "100vh",
                overflowY: "auto",
                width: "100%",
                maxWidth: "500px",
                boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
                display: "flex",
                padding: "16px",
              }}
            >
              <IconButton
                onClick={handleCloseModal}
                sx={{ alignSelf: "flex-end", mb: 2 }}
              >
                <CloseIcon />
              </IconButton>
              <ProductListingSideBar
                isChecked={isChecked}
                onSwitchChange={handleSwitchChange}
                sortOptions={sortOptions}
                price={price}
                handlePriceChange={handlePriceChange}
                handleChangeSort={handleChangeSort}
                sortOrder={sortOrder}
                selectedBrands={selectedBrands}
                toggleBrand={(id) => toggleSelect(id, setSelectedBrands)}
                tagsToShow={showMore ? filterBrands : filterBrands?.slice(0, 5)}
                showMore={showMore}
                setShowMore={setShowMore}
                setStyleShowMore={setStyleShowMore}
                styleShowMore={styleShowMore}
                setBrandShow={setBrandShow}
                brandShow={brandShow}
                setSelectedBrands={setSelectedBrands}
                tags={filterBrands}
                sizes={filterSizes}
                selectedSizes={selectedSizes}
                toggleSize={(id) => toggleSelect(id, setSelectedSizes)}
                otherAttributes={filterData}
                toggleOtherAttributes={(id) =>
                  toggleSelect(id, setOtherSelectedAttributes)
                }
                otherSelectedAttributes={otherSelectedAttributes}
                color={filterColors}
                selectedColor={selectedColor}
                toggleColor={(id) => toggleSelect(id, setSelectedColor)}
                handleSearch={handleSearch}
                searchTerm={searchTerm}
                handleReset={handleReset}
                applyFilters={applyFilters}
              />
            </FadeBox>
          </Fade>
        </Modal>
        <Grid container spacing={4}>
          <Grid
            size={{
              xs: 12,
              md: 3,
            }}
            sx={{ display: { xs: "none", md: "block" } }}
          >
            {filterLoading ? (
              <SidebarShimmer />
            ) : (
              <ProductListingSideBar
                isChecked={isChecked}
                onSwitchChange={handleSwitchChange}
                sortOptions={sortOptions}
                price={price}
                handlePriceChange={handlePriceChange}
                handleChangeSort={handleChangeSort}
                sortOrder={sortOrder}
                selectedBrands={selectedBrands}
                toggleBrand={(id) => toggleSelect(id, setSelectedBrands)}
                tagsToShow={showMore ? filterBrands : filterBrands?.slice(0, 5)}
                showMore={showMore}
                setShowMore={setShowMore}
                setStyleShowMore={setStyleShowMore}
                styleShowMore={styleShowMore}
                setBrandShow={setBrandShow}
                brandShow={brandShow}
                setSelectedBrands={setSelectedBrands}
                tags={filterBrands}
                sizes={filterSizes}
                selectedSizes={selectedSizes}
                toggleSize={(id) => toggleSelect(id, setSelectedSizes)}
                otherAttributes={filterData}
                toggleOtherAttributes={(id) =>
                  toggleSelect(id, setOtherSelectedAttributes)
                }
                otherSelectedAttributes={otherSelectedAttributes}
                color={filterColors}
                selectedColor={selectedColor}
                toggleColor={(id) => toggleSelect(id, setSelectedColor)}
                handleSearch={handleSearch}
                searchTerm={searchTerm}
                handleReset={handleReset}
                applyFilters={applyFilters}
              />
            )}
          </Grid>

          <Grid
            size={{
              xs: 12,
              md: 9,
            }}
          >
            {loading ? (
              <ProductShimmer />
            ) : (
              <>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: { xs: "space-between", sm: "flex-end" },
                    alignItems: "center",
                  }}
                >
                  <Box
                    onClick={handleOpenModal}
                    sx={{
                      display: { xs: "block", sm: "none" },
                      py: "7px",
                      px: 1.5,
                      ml: "5px",
                      backgroundColor: "#bb1f2a",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    <MdOutlineFilterAlt color="#fff" />
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    <ProductGridToggle
                      gridTogal={gridTogal}
                      onToggle={setGridTogal}
                      loading={loading}
                    />
                    <FormControl size="small" variant="outlined">
                      <Select
                        onChange={handlePagination}
                        value={pagination}
                        inputProps={{ MenuProps: { disableScrollLock: true } }}
                        sx={{
                          "&:focus": { backgroundColor: "transparent" },
                          display: "flex",
                          alignItems: "center",
                          height: "44px !important",
                        }}
                        id="paginateNumber"
                        MenuProps={{
                          PaperProps: {
                            sx: { outline: "none" },
                          },
                        }}
                      >
                        <MenuItem value="30">{t("showing")}</MenuItem>
                        <MenuItem value="30">30</MenuItem>
                        <MenuItem value="39">39</MenuItem>
                        <MenuItem value="48">48</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                </Box>
                <Typography sx={{ fontWeight: "bold", mt: 2, mb: 2 }}>
                  {data?.data?.total_products} {t("total_products")}
                </Typography>

                <FilterTags
                  main_category={data?.data?.main_category}
                  selectedCatlist={selectedCatlist}
                  onTagToggle={handleNewestChange}
                />
                <ProductListingContent
                  gridTogal={gridTogal}
                  data={data?.data?.products}
                />
              </>
            )}
          </Grid>
        </Grid>
        {totalPages > 1 && (
          <PaginationComponent
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        )}
      </Container>
    </>
  );
};

export default ProductListing;
