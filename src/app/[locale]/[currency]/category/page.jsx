import React from "react";
import serverAxios from "@/utils/services/serverAxios/serverAxios";
import CategoryList from "@/components/CategoryList";

const getCategory = async (locale, currency) => {
  try {
    const response = await serverAxios.get("category", {
      headers: {
        lng: locale,
        currency: currency,
      },
    });
    if (!response || response.status !== 200 || !response.data) {
      throw new Error("Failed to fetch category");
    }
    return response.data;
  } catch (error) {
    console.error("Error fetching category:", error.message);
    return null;
  }
};

export async function generateMetadata() {
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
      "beds-mattress",
      "carpets",
      "perfumes-air-fresheners-cosmatics",
      "bathroom",
      "hotel-line",
      "home-accessories",
      "kitchen",
      "pajamas-lingerie",
      "saving-packages",
      "bags",
      "baby",
    ],
    openGraph: {
      title: `Shop from the largest collection of bedding, featuring comforter set , duvet, and bedspreads`,
      description: `Shop from the largest collection of bedding, featuring comforter set , duvet, and bedspreads in UAE , KSA & Oman king comforter , single, and queen sizes  Choose from cotton, microfiber, and other materials for a perfect comforter and a better night's sleep`,
      images: [
        {
          url: "https://media.alsaadhome.com/uploads/categories/1617538211.jpeg",
          width: 800,
          height: 600,
          alt: "Categories",
        },
      ],
    },
  };
}

const Page = async () => {
  const data = await getCategory();

  if (!data || !data?.data) {
    return <p>Category details not found.</p>;
  }

  return <CategoryList data={data?.data} />;
};

export default Page;
