import Head from 'next/head';

interface SEOProps {
  title: string;
  description: string;
  keywords: string;
  ogType?: string;
  canonical?: string;
  schema?: any;
}

export default function SEO({
  title,
  description,
  keywords,
  ogType = 'website',
  canonical,
  schema
}: SEOProps) {
  const siteUrl = 'https://basilus.com';
  const fullUrl = canonical ? `${siteUrl}${canonical}` : siteUrl;

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      
      {/* Canonical URL */}
      {canonical && <link rel="canonical" href={fullUrl} />}
      
      {/* Schema.org */}
      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      )}
    </Head>
  );
} 