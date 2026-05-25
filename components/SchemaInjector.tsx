import React from "react";

interface SchemaInjectorProps {
  type: "Quotation" | "Course" | "EducationalOccupationalProgram";
  data: Record<string, any>;
}

export const SchemaInjector: React.FC<SchemaInjectorProps> = ({
  type,
  data,
}) => {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": type,
    ...data,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
};
