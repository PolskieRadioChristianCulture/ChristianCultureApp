import { useEffect } from "react";

interface SchemaProps {
  type: "Scripture" | "Book" | "Organization" | "Article";
  data: Record<string, any>;
}

export function SEOSchema({ type, data }: SchemaProps) {
  useEffect(() => {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": type,
      ...data,
    });

    // Manage adding and removing the script from the document head
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [type, data]);

  return null;
}
