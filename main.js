// main.js

(() => {
  const config = window.projectConfig;

  // Cache DOM elements once
  const pageTitle = document.getElementById('page-title');
  const metaDescription = document.getElementById('meta-description');
  const projectTitle = document.getElementById('project-title');
  const footerLogo = document.getElementById('footer-logo');
  const arButton = document.getElementById('ar-button');
  const fallback = document.getElementById('fallback');

  // Update meta and page content
  if (config) {
    document.title = `${config.title} AR`;
    pageTitle.textContent = `${config.title} AR`;
    metaDescription.setAttribute("content", config.description);
    projectTitle.textContent = config.title;

    if (footerLogo && config.logo) {
      footerLogo.src = config.logo;
    }

    const isiOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
    const isAndroid = /Android/i.test(navigator.userAgent);

    if (isiOS) {
      arButton.innerHTML = `
        <a rel="ar" href="${config.usdz}" aria-label="View ${config.title} in AR on iOS">
          <img src="${config.image}" alt="View in AR" loading="eager" />
        </a>
      `;
    } else if (isAndroid) {
      const intentUrl = `intent://arvr.google.com/scene-viewer/1.0?file=${encodeURIComponent(config.glb)}&mode=ar_preferred#Intent;scheme=https;package=com.google.android.googlequicksearchbox;action=android.intent.action.VIEW;end;`;
      arButton.innerHTML = `
        <a href="${intentUrl}" aria-label="View ${config.title} in AR on Android">
          <img src="${config.image}" alt="View in AR" loading="eager" />
        </a>
      `;
    } else {
      fallback.textContent = 'AR is only supported on iOS and Android devices.';
      arButton.innerHTML = `<button class="disabled-btn" disabled>AR Not Available</button>`;
    }
  } else {
    console.error("projectConfig is not defined");
  }
})();
