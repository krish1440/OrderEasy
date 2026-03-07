import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
    title?: string;
    description?: string;
    keywords?: string;
    type?: string;
    name?: string;
}

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

    return (
        <Helmet>
            <title>{fullTitle}</title>
            <meta name='description' content={description || defaultDescription} />
            <meta name='keywords' content={keywords || defaultKeywords} />
            <link rel="canonical" href="https://order-easy-blond.vercel.app/" />

            {/* Facebook tags */}
            <meta property="og:type" content={type} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description || defaultDescription} />
            <meta property="og:site_name" content={name} />

            {/* Twitter tags */}
            <meta name="twitter:creator" content={name} />
            <meta name="twitter:card" content={type === 'article' ? 'summary_large_image' : 'summary'} />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description || defaultDescription} />
        </Helmet>
    );
};
