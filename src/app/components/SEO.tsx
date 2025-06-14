import Head from 'next/head';
import { FC } from 'react';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
  ogType?: string;
  canonical?: string;
  schema?: Record<string, any>;
}

const SEO: FC<SEOProps> = ({
  title,
  description,
  keywords,
  ogImage = '/default-og.jpg',
  ogType = 'website',
  canonical,
  schema
}) => {
  const siteTitle = `${title} | Basilus`;
  const fullCanonical = canonical ? `https://basilus.com${canonical}` : undefined;

  return (
    <Head>
      <title>{siteTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      
      {/* Open Graph */}
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:image" content={ogImage} />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      
      {/* Canonical */}
      {fullCanonical && <link rel="canonical" href={fullCanonical} />}
      
      {/* Schema.org */}
      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema)
          }}
        />
      )}
    </Head>
  );
};

export default SEO; 