/**
 * MathWorks Offline Clone - Central Router & Link Manager
 * Ensures that clicking logos, navigation items, course cards, and tabs
 * stays 100% within our local code and never redirects to official mathworks.com.
 */
(function() {
  'use strict';

  // Guarantee offline session cookie so MathWorks scripts don't trigger SSO redirects
  try {
    document.cookie = "mwa_SID=offline_clone_session; path=/";
    document.cookie = "mwa_logged_in=true; path=/";
  } catch(e) {}

  // Stub MWEmbeddedStatus if it ever tries to redirect
  window.MWEmbeddedStatus = {
    initialize: function() {},
    checkStatus: function() {},
    redirectToSSO: function() {},
    instance: { config: { skipCheck: true } }
  };

  const OTS_URL = '/ots.html';

  const COURSE_MAP = {
    'simulink onramp': '/matlab%20courses/Simulink%20Onramp%20_%20Self-Paced%20Online%20Courses%20-%20MATLAB%20%26%20Simulink.html',
    'solve systems of first-order odes': '/matlab%20courses/Solve%20Systems%20of%20First-Order%20ODEs%20_%20Self-Paced%20Online%20Courses%20-%20MATLAB%20%26%20Simulink.html',
    'solving nonlinear equations with matlab': '/matlab%20courses/Solving%20Nonlinear%20Equations%20with%20MATLAB%20_%20Self-Paced%20Online%20Courses%20-%20MATLAB%20%26%20Simulink.html',
    'core matlab skills': '/matlab%20courses/Core%20MATLAB%20Skills%20_%20Self-Paced%20Online%20Courses%20-%20MATLAB%20%26%20Simulink.html',
    'introduction to solving ordinary differential equations': '/matlab%20courses/Introduction%20to%20Solving%20Ordinary%20Differential%20Equations%20_%20Self-Paced%20Online%20Courses%20-%20MATLAB%20%26%20Simulink.html',
    'calculations with vectors and matrices': '/matlab%20courses/Calculations%20with%20Vectors%20and%20Matrices%20_%20Self-Paced%20Online%20Courses%20-%20MATLAB%20%26%20Simulink.html',
    'organize your functions': '/matlab%20courses/Organize%20Your%20Functions%20_%20Self-Paced%20Online%20Courses%20-%20MATLAB%20%26%20Simulink.html',
    'introduction to linear algebra with matlab': '/matlab%20courses/Introduction%20to%20Linear%20Algebra%20with%20MATLAB%20_%20Self-Paced%20Online%20Courses%20-%20MATLAB%20%26%20Simulink.html',
    'curve fitting onramp': '/matlab%20courses/Curve%20Fitting%20Onramp%20_%20Self-Paced%20Online%20Courses%20-%20MATLAB%20%26%20Simulink.html',
    'programming in matlab': '/matlab%20courses/Programming%20in%20MATLAB%20_%20Self-Paced%20Online%20Courses%20-%20MATLAB%20%26%20Simulink.html',
    'debugging and error handling': '/matlab%20courses/Debugging%20and%20Error%20Handling%20_%20Self-Paced%20Online%20Courses%20-%20MATLAB%20%26%20Simulink.html',
    'simulink fundamentals': '/matlab%20courses/Simulink%20Fundamentals%20_%20Self-Paced%20Online%20Courses%20-%20MATLAB%20%26%20Simulink.html'
  };

  function showCloneToast(message) {
    let toast = document.getElementById('mw-clone-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'mw-clone-toast';
      toast.style.cssText = 'position:fixed;bottom:24px;right:24px;background:#005f87;color:#fff;padding:12px 20px;border-radius:4px;box-shadow:0 4px 12px rgba(0,0,0,0.2);font-family:"Arial",sans-serif;font-size:14px;z-index:999999;transition:opacity 0.3s, transform 0.3s;pointer-events:none;display:flex;align-items:center;gap:10px;opacity:0;transform:translateY(10px);';
      document.body.appendChild(toast);
    }
    toast.innerHTML = '<span style="font-size:16px;font-weight:bold;">✓</span> ' + message;
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
    clearTimeout(toast._timer);
    toast._timer = setTimeout(function() {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
    }, 2500);
  }

  function resolveLocalDestination(el) {
    if (!el) return null;

    // 1. Top Logo Membrane Icon or Brand Anchor
    if (el.classList.contains('navbar-brand') || el.closest('.navbar-brand') ||
        (el.tagName === 'IMG' && el.classList.contains('mw_logo')) ||
        (el.tagName === 'A' && el.querySelector('.mw_logo'))) {
      const text = (el.textContent || '').trim().toLowerCase();
      if (text.includes('mathworks account')) {
        return '/account.html';
      }
      return '/index.html';
    }

    const href = el.getAttribute('href') || '';
    const text = (el.textContent || '').trim().toLowerCase();
    const testId = el.getAttribute('data-test-id') || '';
    const actionUrl = el.getAttribute('data-action-url') || '';

    // 2. Certificate Buttons
    if (testId === 'certificateBtn' || text.includes('certificate & progress report') || text.includes('digital credential & certificate')) {
      return 'CERT_MODAL';
    }

    // 3. User Avatar dropdown items
    if (el.id === 'mwanav_item_account' || el.classList.contains('mwa-account') || text === 'my account') {
      return '/account.html';
    }
    if (el.id === 'mwanav_item_community' || el.classList.contains('mwa-community-profile') || text === 'my community profile') {
      return '/account.html#profile';
    }
    if (el.id === 'mwanav_item_associate' || el.classList.contains('mwa-link-license') || text === 'link license') {
      return '/account.html#licenses';
    }
    if (text === 'sign out' || el.classList.contains('mwa-logout')) {
      return 'SIGN_OUT';
    }

    // 4. Explicit test IDs
    if (testId === 'homeLink' || testId === 'myCoursesLink') return '/index.html';
    if (testId === 'otsLink') return OTS_URL;
    if (testId === 'docLink') return '/documentation.html';
    if (testId === 'supportLink') return '/support.html';
    if (testId === 'faqLink') return '/faqs.html';

    // 5. Account Tabs & Support
    if (text === 'overview' || href === '#overview') return '/account.html#overview';
    if (text === 'profile' || text.includes('view profile') || text.includes('edit profile') || href === '#profile') return '/account.html#profile';
    if (text === 'licenses' || text.includes('manage licenses') || href === '#licenses') return '/account.html#licenses';
    if (text === 'security' || text.includes('security settings') || href === '#security') return '/account.html#security';
    if (text.includes('communication settings') || href === '#communication') return '/account.html#communication';
    if (text.includes('orders and quotes') || href === '#orders') return '/account.html#orders';
    if (text.includes('contact support') || text === 'support' || href.includes('contact_us') || href.includes('support.html') || el.id === 'globalnav_item_mobile_cta_support' || el.id === 'mobile_cta_support') return '/support.html';

    // 6. Course Title matches
    for (const [title, path] of Object.entries(COURSE_MAP)) {
      if (text === title || (text.length > 5 && title.includes(text))) {
        return path;
      }
    }

    // Check parent course card
    const courseCard = el.closest('[data-test-id="courseInstance"]');
    if (courseCard && (el.classList.contains('Link_link__15ydg') || el.closest('a'))) {
      const cardTitleEl = courseCard.querySelector('[data-test-id="courseTitle"]');
      if (cardTitleEl) {
        const cTitle = cardTitleEl.textContent.trim().toLowerCase();
        for (const [title, path] of Object.entries(COURSE_MAP)) {
          if (cTitle === title || cTitle.includes(title)) {
            return path;
          }
        }
      }
    }

    // 7. Top Navigation Bar items
    if (text.includes('help center') || text === 'matlab help center' || text === 'documentation') {
      return '/documentation.html';
    }
    if (text.includes('community') || text.includes('matlab central')) {
      return '/community.html';
    }
    if (text === 'learning' || text.includes('self-paced online courses') || text === 'my courses' || text === 'home' || text.includes('view all courses') || text.includes('browse course catalog')) {
      return '/index.html';
    }
    if (text.includes('online training suite')) {
      return OTS_URL;
    }
    if (text.includes('faq') || text.includes('frequently asked questions')) {
      return '/faqs.html';
    }

    // 8. Action URLs
    if (actionUrl) {
      if (actionUrl === '/index.html' || actionUrl.includes('index.html')) return '/index.html';
      if (actionUrl.includes('account')) return '/account.html';
    }

    // 9. Inspect href patterns
    if (href) {
      if (href === '#' || href.startsWith('javascript:')) {
        return null;
      }
      if (href.startsWith('#')) {
        return href;
      }
      if (href.includes('/account.html') || href.includes('account.mathworks.com')) {
        if (href.includes('license')) return '/account.html#licenses';
        if (href.includes('profile')) return '/account.html#profile';
        if (href.includes('security')) return '/account.html#security';
        return '/account.html';
      }
      if (href.includes('/help/') || href.includes('documentation.html')) return '/documentation.html';
      if (href.includes('matlabcentral') || href.includes('community.html')) return '/community.html';
      if (href.includes('faq')) return '/faqs.html';
      if (href.includes('matlabacademy') || href.includes('/courses/') || href.includes('index.html')) return '/index.html';

      // If it points to any mathworks.com or external domain, keep strictly in clone
      if (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('//') || href.includes('mathworks.com')) {
        return '/index.html';
      }
    }

    return null;
  }

  // Global click event dispatcher
  document.addEventListener('click', function(e) {
    // Skip if clicking inside certificate modal body (except close button)
    if (e.target.closest('#certificateModal') && !e.target.closest('#closeCertModal')) {
      return;
    }

    const clickable = e.target.closest('a, button[data-action-url], [data-test-id="certificateBtn"]');
    if (!clickable) {
      // Check if user clicked directly on the membrane logo image
      if (e.target.classList && e.target.classList.contains('mw_logo')) {
        e.preventDefault();
        e.stopPropagation();
        window.location.href = '/index.html';
        return;
      }
      return;
    }

    const dest = resolveLocalDestination(clickable);

    if (dest === 'CERT_MODAL') {
      e.preventDefault();
      e.stopPropagation();
      const card = clickable.closest('[data-test-id="courseInstance"]');
      let title = 'MATLAB Course';
      if (card) {
        const titleEl = card.querySelector('[data-test-id="courseTitle"]');
        if (titleEl) title = titleEl.textContent.trim();
      }
      if (typeof window.openCertificateModal === 'function') {
        window.openCertificateModal(title);
      } else {
        window.location.href = '/index.html?openCert=' + encodeURIComponent(title);
      }
      return;
    }

    if (dest === 'SIGN_OUT') {
      e.preventDefault();
      e.stopPropagation();
      showCloneToast('You are signed in as Himanshu (MathWorks Offline Clone).');
      return;
    }

    if (dest) {
      // In-page hash tab switch (e.g. #profile, #licenses)
      if (dest.startsWith('#')) {
        const tab = dest.slice(1);
        if (typeof window.switchTab === 'function') {
          e.preventDefault();
          e.stopPropagation();
          window.switchTab(tab);
          window.location.hash = dest;
          return;
        } else {
          e.preventDefault();
          e.stopPropagation();
          window.location.href = '/account.html' + dest;
          return;
        }
      }

      // If pointing to account.html with a hash
      if (dest.startsWith('/account.html#')) {
        const tab = dest.split('#')[1];
        if (window.location.pathname.endsWith('account.html') && typeof window.switchTab === 'function') {
          e.preventDefault();
          e.stopPropagation();
          window.switchTab(tab);
          window.location.hash = '#' + tab;
          return;
        }
      }

      // Local page redirection
      e.preventDefault();
      e.stopPropagation();
      window.location.href = dest;
      return;
    }

    // Fallback safeguard against any external mathworks redirection
    const rawHref = clickable.getAttribute('href');
    if (rawHref && (rawHref.startsWith('http://') || rawHref.startsWith('https://') || rawHref.includes('mathworks') || rawHref.includes('thingspeak'))) {
      e.preventDefault();
      e.stopPropagation();
      showCloneToast('Retained within MathWorks offline clone.');
      return false;
    }
  }, true);

  // Rewrite all anchor hrefs in the DOM so browser URL status preview matches offline targets
  function rewriteDOMHrefs() {
    // 1. Top Logo Membrane icons
    document.querySelectorAll('.navbar-brand, a:has(img.mw_logo)').forEach(function(brand) {
      const text = (brand.textContent || '').trim().toLowerCase();
      if (text.includes('mathworks account')) {
        brand.setAttribute('href', '/account.html');
      } else {
        brand.setAttribute('href', '/index.html');
      }
    });

    // 2. Header nav links
    document.querySelectorAll('#globalnav_item_helpcenter a').forEach(function(a) { a.setAttribute('href', '/documentation.html'); });
    document.querySelectorAll('#globalnav_item_community a').forEach(function(a) { a.setAttribute('href', '/community.html'); });
    document.querySelectorAll('#globalnav_item_learning a').forEach(function(a) { a.setAttribute('href', '/index.html'); });
    document.querySelectorAll('[data-test-id="homeLink"]').forEach(function(a) { a.setAttribute('href', '/index.html'); });
    document.querySelectorAll('[data-test-id="myCoursesLink"]').forEach(function(a) { a.setAttribute('href', '/index.html'); });
    document.querySelectorAll('[data-test-id="otsLink"]').forEach(function(a) { a.setAttribute('href', OTS_URL); });
    document.querySelectorAll('[data-test-id="docLink"]').forEach(function(a) { a.setAttribute('href', '/documentation.html'); });
    document.querySelectorAll('[data-test-id="supportLink"]').forEach(function(a) { a.setAttribute('href', '/support.html'); });
    document.querySelectorAll('[data-test-id="faqLink"]').forEach(function(a) { a.setAttribute('href', '/faqs.html'); });
    document.querySelectorAll('#globalnav_item_mobile_cta_support a, a[href*="contact_us"]').forEach(function(a) { a.setAttribute('href', '/support.html'); });

    // User Avatar dropdown items
    const accItem = document.querySelector('#mwanav_item_account a, .mwa-account');
    if (accItem) accItem.setAttribute('href', '/account.html');
    const commItem = document.querySelector('#mwanav_item_community a, .mwa-community-profile');
    if (commItem) commItem.setAttribute('href', '/account.html#profile');
    const licItem = document.querySelector('#mwanav_item_associate a, .mwa-link-license');
    if (licItem) licItem.setAttribute('href', '/account.html#licenses');

    // 3. Course cards
    document.querySelectorAll('[data-test-id="courseInstance"]').forEach(function(card) {
      const titleEl = card.querySelector('[data-test-id="courseTitle"]');
      if (titleEl) {
        const text = titleEl.textContent.trim().toLowerCase();
        for (const [title, path] of Object.entries(COURSE_MAP)) {
          if (text === title || text.includes(title)) {
            const a = card.querySelector('[data-test-id="courseTitle"] a');
            if (a) a.setAttribute('href', path);
            const imgA = card.querySelector('[data-test-id="courseInstanceImg"] a');
            if (imgA) imgA.setAttribute('href', path);
            break;
          }
        }
      }
    });

    // 4. MathWorks account cards & buttons
    document.querySelectorAll('[data-action-url]').forEach(function(el) {
      const act = el.getAttribute('data-action-url');
      if (act && act.includes('courses')) {
        el.setAttribute('data-action-url', '/index.html');
      }
    });
  }

  // Handle URL params like ?openCert=...
  function checkUrlParams() {
    const params = new URLSearchParams(window.location.search);
    if (params.has('openCert') && typeof window.openCertificateModal === 'function') {
      setTimeout(function() {
        window.openCertificateModal(decodeURIComponent(params.get('openCert') || 'MATLAB Course'));
      }, 250);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      rewriteDOMHrefs();
      checkUrlParams();
    });
  } else {
    rewriteDOMHrefs();
    checkUrlParams();
  }

  // Export helper
  window.MathWorksLocalRouter = {
    COURSE_MAP: COURSE_MAP,
    showToast: showCloneToast
  };
})();
