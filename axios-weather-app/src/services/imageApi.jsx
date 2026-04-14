import axios from "axios";

const IMAGE_API_KEY = "55429583-1a6382302408bcc3b423026cd";

/*
  Using Pixabay as a simple frontend-friendly placeholder.
  You can switch to Unsplash or Pexels later if you want.
*/
export const getCityImage = async (city) => {
  try {
    const response = await axios.get("https://pixabay.com/api/", {
      params: {
        key: IMAGE_API_KEY,
        q: `${city} city`,
        image_type: "photo",
        orientation: "horizontal",
        category: "places",
        per_page: 10,
      },
    });

    const hits = response.data?.hits || [];

    if (hits.length > 0) {
      return hits[0].largeImageURL || hits[0].webformatURL;
    }

    return `https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80`;
  } catch (error) {
    return `https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80`;
  }
};