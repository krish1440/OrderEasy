import React from 'react';
import { Helmet } from 'react-helmet-async';

/**
 * Properties for configuring dynamic SEO meta tags and open graph metadata.
 * 
 * @interface SEOProps
 * @property {string} [title] - Page specific title prefix (e.g. "Analytics Dashboard")
 * @property {string} [description] - Meta description for search engines and social cards
 * @property {string} [keywords] - Comma-separated search keywords
 * @property {string} [type='website'] - OpenGraph object type (e.g., 'website', 'article')
 * @property {string} [name='OrderEazy'] - Platform brand name
 */
interface SEOProps {
    title?: string;
    description?: string;
    keywords?: string;
    type?: string;
    name?: string;
}

/**
 * Standardized Search Engine Optimization (SEO) Component.
 * Dynamically manages document head title, meta descriptions, canonical URLs,
 * OpenGraph / Twitter social preview tags, and Schema.org JSON-LD structured data.
 *
 * @component
 * @example
 * ```tsx
 * <SEO 
 *   title="Orders Management" 
 *   description="Track, filter, and analyze customer order status in real time."
 * />
 * ```
 */
export const SEO: React.FC<SEOProps> = ({
    title,
    description,
    keywords,
    type = 'website',
    name = 'OrderEazy'
}) => {
    const siteTitle = 'OrderEazy Analytics';
    const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;
    const defaultDescription = 'OrderEazy - Complete order, delivery, and analytics management system. Advanced tracking, exports, and real-time business insights.';
    const defaultKeywords = 'order, delivery, export, analytics, management system, inventory, tracking, real-time insights, business metrics';

    /**
     * Schema.org JSON-LD structured data for rich search engine results.
     */
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": name,
        "operatingSystem": "Web",
        "applicationCategory": "BusinessApplication",
        "description": description || defaultDescription,
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.9",
            "ratingCount": "120"
        },
        "offers": {
            "@type": "Offer",
            "price": "0.00",
            "priceCurrency": "USD"
        }
    };

    return (
        <Helmet>
            {/* Document Title & Basic Metadata */}
            <title>{fullTitle}</title>
            <meta name='description' content={description || defaultDescription} />
            <meta name='keywords' content={keywords || defaultKeywords} />
            <link rel="canonical" href="https://order-easy-blond.vercel.app/" />

            {/* Schema.org JSON-LD Structured Data */}
            <script type="application/ld+json">
                {JSON.stringify(structuredData)}
            </script>

            {/* Open Graph Meta Tags for Facebook, LinkedIn & Slack */}
            <meta property="og:type" content={type} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description || defaultDescription} />
            <meta property="og:site_name" content={name} />
            <meta property="og:image" content="https://order-easy-blond.vercel.app/bg-analytics.png" />

            {/* Twitter Card Meta Tags */}
            <meta name="twitter:creator" content={name} />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description || defaultDescription} />
            <meta name="twitter:image" content="https://order-easy-blond.vercel.app/bg-analytics.png" />
        </Helmet>
    );
};
