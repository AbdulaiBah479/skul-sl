import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Skul SL — free learning for Sierra Leone",
    short_name: "Skul SL",
    description: "Free lessons, quizzes, exam practice, tools and an AI tutor for every student in Sierra Leone.",
    start_url: "/",
    display: "standalone",
    background_color: "#f6f8f5",
    theme_color: "#14803c",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
    ],
  };
}
