type JsonLdProps = {
  data: object | object[];
};

const JsonLd = ({ data }: JsonLdProps) => {
  const jsonLd = Array.isArray(data)
    ? { "@context": "https://schema.org", "@graph": data }
    : { "@context": "https://schema.org", ...data };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
    />
  );
};

export default JsonLd;
