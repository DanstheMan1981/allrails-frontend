import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonicalPath?: string;
  ogImage?: string;
  noIndex?: boolean;
  jsonLd?: object;
}

const SEO: React.FC<SEOProps> = ({
  title = 'AllRails — One Link. Every Payment.',
  description = 'Share one link and let anyone pay you with Venmo, Cash App, PayPal, or Apple Pay. Free forever. Set up in 30 seconds.',
  keywords = 'payment link, universal payment, Venmo link, Cash App link, PayPal link, Apple Pay, digital wallet, payment page',
  canonicalPath,
  ogImage = 'https://allrails.app/og-image.png',
  noIndex = false,
  jsonLd,
}) => {
  const fullTitle = title.includes('AllRails') ? title : `${title} | AllRails`;
  const canonicalUrl = canonicalPath ? `https://allrails.app${canonicalPath}` : 'https://allrails.app';

  const defaultJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        name: 'AllRails',
        url: 'https://allrails.app',
        description: 'Universal payment link — one link for Venmo, Cash App, PayPal, and Apple Pay',
      },
      {
        '@type': 'Organization',
        name: 'AllRails',
        url: 'https://allrails.app',
        logo: 'https://allrails.app/allrails-logo.png',
        description: 'Universal payment link platform by The Bot Collective',
        foundingDate: '2025',
        parentOrganization: {
          '@type': 'Organization',
          name: 'The Bot Collective',
          url: 'https://thebotcollective.com',
        },
      },
    ],
  };

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="The Bot Collective" />
      <meta name="robots" content={noIndex ? 'noindex, nofollow' : 'index, follow'} />
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="AllRails" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      <script type="application/ld+json">
        {JSON.stringify(jsonLd || defaultJsonLd)}
      </script>
    </Helmet>
  );
};

export default SEO;
