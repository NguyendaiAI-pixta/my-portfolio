// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

export const SITE_TITLE = 'AI Knowledge Hub';
export const SITE_DESCRIPTION = 'Hệ thống kiến thức AI từ cơ bản đến chuyên sâu - Computer Vision, LLM, Agents, MLOps, LLMOps';
export const SITE_AUTHOR = 'AI Engineer';
export const SITE_EMAIL = 'forworkainguyendai@gmail.com';

// Social Links
export const SOCIAL_LINKS = {
  email: 'forworkainguyendai@gmail.com'
};

// ===== MONETIZATION CONFIGURATION =====

// Google AdSense Configuration
export const ADSENSE_CONFIG = {
  enabled: false, // Set to true when AdSense is approved
  publisherId: 'ca-pub-XXXXXXXXXXXXXXXX', // Replace with your AdSense Publisher ID
  slots: {
    header: 'XXXXXXXXXX', // Header banner ad slot ID
    inArticle: 'XXXXXXXXXX', // In-article ad slot ID
    footer: 'XXXXXXXXXX', // Footer banner ad slot ID
    sidebar: 'XXXXXXXXXX', // Sidebar ad slot ID
  },
};

// Premium Subscription Configuration
export const PREMIUM_CONFIG = {
  enabled: false, // Set to true when premium subscriptions are ready
  pricing: {
    monthly: {
      price: 9.99,
      currency: 'USD',
      features: [
        'Unlimited access to all articles',
        'New content every week',
        'Download PDF versions',
        'Cancel anytime',
      ],
    },
    yearly: {
      price: 79.99,
      currency: 'USD',
      savings: '33%',
      features: [
        'Everything in Monthly',
        'Priority email support',
        'Exclusive tutorials',
        'Community access',
      ],
    },
  },
  paymentProviders: {
    stripe: {
      enabled: false,
      publicKey: 'pk_test_XXXXXXXXXXXXXXXX', // Stripe public key
    },
    paypal: {
      enabled: false,
      clientId: 'XXXXXXXXXXXXXXXX', // PayPal client ID
    },
  },
  trialPeriod: 7, // Days for money-back guarantee
};

// Analytics Configuration
export const ANALYTICS_CONFIG = {
  googleAnalytics: {
    enabled: false, // Set to true when GA is set up
    measurementId: 'G-XXXXXXXXXX', // GA4 Measurement ID
  },
};

// Content Strategy
export const CONTENT_STRATEGY = {
  // Define which posts should be premium
  premiumCategories: ['advanced-tutorials', 'premium-courses'],
  // Free preview length (number of paragraphs)
  freePreviewLength: 3,
  // Minimum traffic before applying for AdSense
  targetMetrics: {
    dailyVisitors: 100,
    monthlyPageviews: 3000,
    minimumPosts: 20,
  },
};
