import React from "react";
import serverAxios from "@/utils/services/serverAxios/serverAxios";
import SubCatLIst from "@/components/SubCatLIst";

async function getSubCat(category_id) {
  try {
    const response = await serverAxios.post("sub_category", { category_id });
    if (!response || response.status !== 200 || !response.data) {
      throw new Error("Failed to fetch sub category");
    }
    return response.data;
  } catch (error) {
    console.error("Error fetching sub category:", error.message);
    return null;
  }
}

export async function generateMetadata({ params }) {
  const category_id = params?.slug;
  if (!category_id) throw new Error("Slug is missing");

  const data = await getSubCat(category_id);
  if (!data)
    return {
      title: "Error loading blog | Alsaad Blog",
      description: "sub category not found.",
    };

  return {
    title: `Shop from the largest collection of bedding, featuring comforter set , duvet, and bedspreads`,
    description: `Shop from the largest collection of bedding, featuring comforter set , duvet, and bedspreads in UAE , KSA & Oman king comforter , single, and queen sizes  Choose from cotton, microfiber, and other materials for a perfect comforter and a better night's sleep`,
    keywords: [
      "comforter-set",
      "duvet-cover-set",
      "bedspread",
      "bed-sheet",
      "pillows",
      "blanket-throw",
      "baby",
    ],
    openGraph: {
      title: `Shop from the largest collection of bedding, featuring comforter set , duvet, and bedspreads`,
      description: `Shop from the largest collection of bedding, featuring comforter set , duvet, and bedspreads in UAE , KSA & Oman king comforter , single, and queen sizes  Choose from cotton, microfiber, and other materials for a perfect comforter and a better night's sleep`,
      images: [
        {
          url: "https://media.alsaadhome.com/uploads/sub_categories/1623508929.jpg",
          width: 800,
          height: 600,
          alt: "Categories",
        },
      ],
    },
  };
}

export default async function Page({ params }) {
  const category_id = params?.slug;

  if (!category_id) throw new Error("Slug is missing");

  const subCat = await getSubCat(category_id);
  if (!subCat || !subCat?.data)
    return <div>SubCategory not found or failed to load.</div>;

  return <SubCatLIst subCat={subCat?.data} />;
}
