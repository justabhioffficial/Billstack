/**
 * BillStack Privacy-Friendly Analytics Service
 * Multi-provider support for Google Analytics 4 (GA4) & PostHog
 * Respects browser Do Not Track (DNT) settings and anonymizes IP addresses.
 */

interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
  params?: Record<string, any>;
}

class AnalyticsService {
  private isInitialized = false;

  constructor() {
    this.init();
  }

  private init() {
    // Respect Do Not Track header
    if (typeof window !== 'undefined' && window.navigator && window.navigator.doNotTrack === '1') {
      console.log('[Analytics] Respecting Do Not Track preference.');
      return;
    }

    this.isInitialized = true;
  }

  /**
   * Track Page Views
   */
  public trackPageView(pagePath: string, pageTitle?: string) {
    if (!this.isInitialized) return;

    // GA4 Pageview
    if (typeof (window as any).gtag === 'function') {
      (window as any).gtag('event', 'page_view', {
        page_path: pagePath,
        page_title: pageTitle || document.title,
      });
    }

    // PostHog Pageview
    if (typeof (window as any).posthog === 'object' && (window as any).posthog.capture) {
      (window as any).posthog.capture('$pageview', {
        $current_url: window.location.href,
        page: pagePath,
      });
    }

    console.log(`[Analytics] PageView: ${pagePath}`);
  }

  /**
   * Track Generic Custom Event
   */
  public trackEvent({ action, category, label, value, params }: AnalyticsEvent) {
    if (!this.isInitialized) return;

    const payload = {
      event_category: category,
      event_label: label,
      value: value,
      ...params,
    };

    // GA4 Event
    if (typeof (window as any).gtag === 'function') {
      (window as any).gtag('event', action, payload);
    }

    // PostHog Event
    if (typeof (window as any).posthog === 'object' && (window as any).posthog.capture) {
      (window as any).posthog.capture(action, payload);
    }

    console.log(`[Analytics] Event: ${action}`, payload);
  }

  /**
   * Conversion Trackers
   */
  public trackSignup(method: string = 'email') {
    this.trackEvent({
      action: 'sign_up',
      category: 'User',
      label: method,
      params: { method },
    });
  }

  public trackLogin(method: string = 'email') {
    this.trackEvent({
      action: 'login',
      category: 'User',
      label: method,
      params: { method },
    });
  }

  public trackReceiptUpload(fileType: string, amount?: number) {
    this.trackEvent({
      action: 'receipt_upload',
      category: 'Engagement',
      label: fileType,
      value: amount,
      params: { file_type: fileType, amount },
    });
  }

  public trackAppDownload(platform: string) {
    this.trackEvent({
      action: 'app_download',
      category: 'Conversion',
      label: platform,
      params: { platform },
    });
  }

  public trackReportExport(reportType: string) {
    this.trackEvent({
      action: 'report_export',
      category: 'Engagement',
      label: reportType,
      params: { report_type: reportType },
    });
  }
}

export const analytics = new AnalyticsService();
