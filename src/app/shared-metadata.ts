import type { Metadata } from "next";

/* Link preview image for every page (1200 × 630) */
const shareImage = {
  url: "/images/share-cover.png",
  width: 1200,
  height: 630,
  alt: "Vlad Todirut, Product Designer/Builder",
};

/*
 * Title + description for a page, repeated into the link preview tags.
 * A page's `openGraph` replaces the root one instead of merging, so every
 * page goes through here to keep the shared fields and the image.
 */
export function pageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: "Vlad Todirut",
      url: path,
      title,
      description,
      images: [shareImage],
    },
    twitter: { card: "summary_large_image", title, description, images: [shareImage] },
  };
}
