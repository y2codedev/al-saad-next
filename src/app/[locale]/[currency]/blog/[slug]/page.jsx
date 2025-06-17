import React from "react";
import BlogDetailsPage from "@/components/blog/BlogDetailsPage";
import serverAxios from "@/utils/services/serverAxios/serverAxios";

async function getBlogDetails(slug) {
  try {
    const response = await serverAxios.post("blog/details", { slug });

    if (!response || response.status !== 200 || !response.data) {
      throw new Error("Failed to fetch blog details");
    }

    return response.data;
  } catch (error) {
    console.error("Error fetching blog details:", error.message);
    return null;
  }
}

export async function generateMetadata({ params }) {
  const slug = params?.slug;
  if (!slug) throw new Error("Slug is missing");

  const data = await getBlogDetails(slug);
  if (!data)
    return {
      title: "Error loading blog | Alsaad Blog",
      description: "Blog details not found.",
    };

  const blog = data?.data?.blogs;
  const title = blog?.title_blog || "Default Blog Title";
  const description = blog?.short_description || "Default Blog Description";
  const image = blog?.image || "https://default-image.com/default.jpg";
  const tags = blog?.tags || [];
  const pageUrl = `https://www.alsaadblog.com/blog/${slug}`;
  const createAt = blog?.created_at;

  return {
    title: `${title} | Alsaad Blog`,
    description,
    alternates: { canonical: pageUrl },
    createAt: createAt,
    openGraph: {
      title: `${title} | Alsaad Blog`,
      description,
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    keywords:
      tags.length > 0 ? tags.join(", ") : "Alsaad Home, Blog, SEO, Bed Seat",
    twitter: {
      card: "summary_large_image",
      site: "@AlsaadBlog",
      title: `${title} | Alsaad Blog`,
      description,
      images: [image],
    },
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      mainEntityOfPage: { "@type": "WebPage", "@id": pageUrl },
      headline: title,
      description,
      image,
      author: { "@type": "Person", name: "Alsaad Editorial Team" },
      publisher: {
        "@type": "Organization",
        name: "Alsaad Blog",
        logo: {
          "@type": "ImageObject",
          url: "http://localhost:3000/_next/static/media/logo.6cc07a22.avif",
        },
      },
    },
  };
}

export default async function Page({ params }) {
  const slug = params?.slug;
  if (!slug) return <div>Blog not found or failed to load.</div>;

  const blogData = await getBlogDetails(slug);
  if (!blogData) return <div>Blog not found or failed to load.</div>;

  return <BlogDetailsPage blog={blogData} slug={slug} />;
}
