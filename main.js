//main.js

(() => {
  const cfg = window.projectConfig;
  if (!cfg) return console.error("projectConfig is not defined");

  document.title = `${cfg.title} AR`;
  document.getElementById("project-title").textContent = cfg.title;
  document.getElementById("meta-description").content = cfg.description;

  const footerLogo = document.getElementById("footer-logo");
  if (footerLogo && cfg.logo) footerLogo.src = cfg.logo;

  const arBtn = document.getElementById("ar-button");
  const fallback = document.getElementById("fallback");

  arBtn.innerHTML = "";
  fallback.textContent = "";

  const ua = navigator.userAgent;
  const isIOS = /iPhone|iPad|iPod/i.test(ua);
  const isAndroid = /Android/i.test(ua);

  const imgHTML = `<img src="${cfg.image}" alt="View ${cfg.title} in AR" loading="eager" />`;

  if (isIOS) {
    // iOS Quick Look using USDZ
    if (cfg.usdz) {
      arBtn.innerHTML = `<a rel="ar" href="${cfg.usdz}" aria-label="View ${cfg.title} in AR">${imgHTML}</a>`;
    } else {
      fallback.textContent = "AR USDZ file is missing in config.";
      arBtn.innerHTML = `<button class="disabled-btn" disabled>AR Not Available</button>`;
    }
  } else if (isAndroid) {
    if (!cfg.glb || !cfg.glb.startsWith("https://")) {
      fallback.textContent = "AR model must be hosted on a public HTTPS URL for Android devices.";
      arBtn.innerHTML = `<button class="disabled-btn" disabled>AR Not Available</button>`;
      return;
    }

    // Build Scene Viewer intent URL with fallback to Play Store
    const sceneViewerIntent = `intent://arvr.google.com/scene-viewer/1.0?file=${encodeURIComponent(cfg.glb)}&mode=ar_preferred#Intent;scheme=https;package=com.google.android.googlequicksearchbox;action=android.intent.action.VIEW;S.browser_fallback_url=https%3A%2F%2Fplay.google.com%2Fstore%2Fapps%2Fdetails%3Fid%3Dcom.google.ar.core;end;`;

    arBtn.innerHTML = `<a href="${sceneViewerIntent}" target="_blank" rel="noopener" aria-label="View ${cfg.title} in AR">${imgHTML}</a>`;
  } else {
    fallback.textContent = "AR is only supported on iOS and Android devices.";
    arBtn.innerHTML = `<button class="disabled-btn" disabled>AR Not Available</button>`;
  }
})();
