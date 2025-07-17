//main.js
(() => {
  const cfg = window.projectConfig;
  if (!cfg) return console.error("projectConfig is not defined");

  // Set page title and meta description
  document.title = `${cfg.title} AR`;
  document.getElementById("project-title").textContent = cfg.title;
  document.getElementById("meta-description").content = cfg.description;

  // Set footer logo
  const footerLogo = document.getElementById("footer-logo");
  if (footerLogo && cfg.logo) footerLogo.src = cfg.logo;

  // References
  const arBtn = document.getElementById("ar-button");
  const fallback = document.getElementById("fallback");

  // Clear any existing content
  arBtn.innerHTML = "";
  fallback.textContent = "";

  // Detect device
  const ua = navigator.userAgent;
  const isIOS = /iPhone|iPad|iPod/i.test(ua);
  const isAndroid = /Android/i.test(ua);

  // Create AR button content image from config
  const imgHTML = `<img src="${cfg.image}" alt="View ${cfg.title} in AR" loading="eager" />`;

  if (isIOS) {
    // iOS Quick Look with .usdz file
    if (cfg.usdz) {
      arBtn.innerHTML = `<a rel="ar" href="${cfg.usdz}" aria-label="View ${cfg.title} in AR">${imgHTML}</a>`;
    } else {
      fallback.textContent = "AR USDZ file is missing in config.";
      arBtn.innerHTML = `<button class="disabled-btn" disabled>AR Not Available</button>`;
    }
  } else if (isAndroid) {
    // Android AR with model-viewer
    if (!cfg.glb || !cfg.glb.startsWith("https://")) {
      fallback.textContent = "AR model must be hosted on a public HTTPS URL for Android devices.";
      arBtn.innerHTML = `<button class="disabled-btn" disabled>AR Not Available</button>`;
      return;
    }

    // Add or reuse hidden model-viewer for AR launch
    let mv = document.querySelector("model-viewer#hidden-ar-launcher");
    if (!mv) {
      mv = document.createElement("model-viewer");
      mv.id = "hidden-ar-launcher";
      mv.setAttribute("src", cfg.glb);
      mv.setAttribute("ar", "");
      mv.setAttribute("ar-modes", "scene-viewer");
      mv.setAttribute("style", "width:0; height:0; position:absolute; visibility:hidden;");
      document.body.appendChild(mv);
    } else {
      // Update src if changed
      if (mv.getAttribute("src") !== cfg.glb) {
        mv.setAttribute("src", cfg.glb);
      }
    }

    arBtn.innerHTML = `<button aria-label="View ${cfg.title} in AR">${imgHTML}</button>`;
    const btn = arBtn.querySelector("button");
    btn.style.cursor = "pointer";

    btn.addEventListener("click", async () => {
      try {
        await mv.enterAR();
      } catch (err) {
        fallback.textContent = "Unable to launch AR viewer on this device/browser.";
      }
    });
  } else {
    // Desktop or unsupported
    fallback.textContent = "AR is only supported on iOS and Android devices.";
    arBtn.innerHTML = `<button class="disabled-btn" disabled>AR Not Available</button>`;
  }
})();
