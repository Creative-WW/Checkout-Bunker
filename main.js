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

  const ua = navigator.userAgent;
  const isIOS = /iPhone|iPad|iPod/i.test(ua);
  const isAndroid = /Android/i.test(ua);

  const imgHTML = `<img src="${cfg.image}" alt="View ${cfg.title} in AR" loading="eager" />`;

  if (isIOS) {
    // iOS Quick Look with .usdz file
    arBtn.innerHTML = `<a rel="ar" href="${cfg.usdz}" aria-label="View ${cfg.title} in AR">${imgHTML}</a>`;
  } else if (isAndroid) {
    // Android Scene Viewer with HTTPS GLB URL
    if (!cfg.glb.startsWith("https://")) {
      fallback.textContent = "AR model must be hosted on a public HTTPS URL for Android devices.";
      arBtn.innerHTML = `<button class="disabled-btn" disabled>AR Not Available</button>`;
      return;
    }

    const sceneViewerUrl = `https://arvr.google.com/scene-viewer/1.0?file=${encodeURIComponent(cfg.glb)}&mode=ar_preferred`;
    arBtn.innerHTML = `<a href="${sceneViewerUrl}" target="_blank" rel="noopener" aria-label="View ${cfg.title} in AR">${imgHTML}</a>`;
  } else {
    // Unsupported device
    fallback.textContent = "AR is only supported on iOS and Android devices.";
    arBtn.innerHTML = `<button class="disabled-btn" disabled>AR Not Available</button>`;
  }
})();
