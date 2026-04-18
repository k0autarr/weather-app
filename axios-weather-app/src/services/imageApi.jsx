import axios from "axios";

const IMAGE_API_KEY = "55429583-1a6382302408bcc3b423026cd";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80";

export const getCityImage = async (city, country = "") => {
  try {
    const query = country
      ? `${city} ${country} skyline city landmark`
      : `${city} skyline city landmark`;

    const response = await axios.get("https://pixabay.com/api/", {
      params: {
        key: IMAGE_API_KEY,
        q: query,
        image_type: "photo",
        orientation: "horizontal",
        category: "places",
        per_page: 10,
        safesearch: true,
      },
    });

    const hits = response.data?.hits || [];

    if (hits.length === 0) {
      console.warn("No images for:", query);
      return FALLBACK_IMAGE;
    }

    // 🔥 Smart selection (not always the first image)
    const validImages = hits.filter(
      (img) =>
        img.imageWidth >= 1000 &&
        img.imageHeight >= 600 &&
        !img.tags.includes("background") &&
        !img.tags.includes("texture")
    );

    const selected =
      validImages[Math.floor(Math.random() * validImages.length)] ||
      hits[0];

    return selected.largeImageURL || selected.webformatURL || FALLBACK_IMAGE;
  } catch (error) {
    console.error("Pixabay fetch error:", error);
    return FALLBACK_IMAGE;
  }
};