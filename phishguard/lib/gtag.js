export const GA_TRACKING_ID = 'G-DCRZEV2SJE'; // Replace with your Measurement ID

// Track page views
export const pageview = (url) => {
  window.gtag('config', GA_TRACKING_ID, {
    page_path: url,
  });
};

// Track specific events
export const event = ({ action, params }) => {
  window.gtag('event', action, params);
};
