import { Helmet } from "react-helmet-async";

const SITE_NAME = "Магия камней";
const BASE_URL = "https://magic-stone.org";
const DEFAULT_IMAGE = `${BASE_URL}/og-image.jpg`;

interface PageSEOProps {
  title: string;
  description: string;
  path?: string;
  image?: string;
  noindex?: boolean;
}

const PageSEO = ({ title, description, path = "", image = DEFAULT_IMAGE, noindex = false }: PageSEOProps) => {
  const fullTitle = `${title} | ${SITE_NAME}`;
  const url = `${BASE_URL}${path}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
};

export default PageSEO;
