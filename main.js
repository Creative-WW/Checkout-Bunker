//main.js

(() => {
  const cfg = window.projectConfig;
  if (!cfg) {
    console.error("projectConfig is not defined");
    return;
  }

  document.title = `${cfg.title} AR`;
  document.getElementById("project-title").textContent = cfg.title;
  document.getElementById("meta-description").content = cfg.description;

  const footerLogo = document.getElementById("footer-logo");
  if (footerLogo && cfg.logo) footerLogo.src = cfg.logo;

  const container = document.getElementById("ar-button-container");
  const fallback = document.getElementById("fallback");

  container.innerHTML = "";
  fallback.textContent = "";

  const ua = navigator.userAgent;
  const isIOS = /iPhone|iPad|iPod/i.test(ua);
  const isAndroid = /Android/i.test(ua);

  if (isIOS) {
    if (!cfg.usdz) {
      fallback.textContent = "USDZ file missing in config.";
      container.innerHTML = `<button class="disabled-btn" disabled>AR Not Available</button>`;
      return;
    }

    const imgHTML = `<img src="${cfg.image}" alt="View ${cfg.title} in AR" loading="eager" />`;
    container.innerHTML = `<a rel="ar" href="${cfg.usdz}" aria-label="View ${cfg.title} in AR">${imgHTML}</a>`;

  } else if (isAndroid) {
    if (!cfg.glb || !cfg.glb.startsWith("https://")) {
      fallback.textContent = "GLB model must be hosted on HTTPS for Android AR.";
      container.innerHTML = `<button class="disabled-btn" disabled>AR Not Available</button>`;
      return;
    }

    // Create a hidden model-viewer for AR launch
    const modelViewer = document.createElement("model-viewer");
    modelViewer.setAttribute("src", cfg.glb);
    modelViewer.setAttribute("ar", "");
    modelViewer.setAttribute("ar-modes", "scene-viewer webxr quick-look");
    modelViewer.style.width = "0";
    modelViewer.style.height = "0";
    modelViewer.style.position = "absolute";
    modelViewer.style.visibility = "hidden";
    document.body.appendChild(modelViewer);

    // Create a button with your image inside
    const btn = document.createElement("button");
    btn.setAttribute("aria-label", `View ${cfg.title} in AR`);
    btn.style.all = "unset";
    btn.style.cursor = "pointer";

    const img = document.createElement("img");
    img.src = cfg.image;
    img.alt = `View ${cfg.title} in AR`;
    img.loading = "eager";
    img.style.width = "100%";
    img.style.height = "100%";
    img.style.objectFit = "contain";
    btn.appendChild(img);

    container.appendChild(btn);

    btn.addEventListener("click", async () => {
      fallback.textContent = "";

      try {
        const canActivate = await modelViewer.canActivateAR;
        if (canActivate) {
          await modelViewer.enterAR();
        } else {
          fallback.textContent = "AR is not supported on this Android device/browser.";
        }
      } catch (err) {
        console.error(err);
        fallback.textContent = "Failed to launch AR viewer.";
      }
    });

  } else {
    // Desktop and other unsupported devices
    fallback.textContent = "AR is only supported on iOS and Android devices.";
    container.innerHTML = `<button class="disabled-btn" disabled>AR Not Available</button>`;
  }
})();
