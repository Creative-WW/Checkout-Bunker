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

    // Prepare hidden model-viewer for fallback AR
    let mv = document.querySelector("model-viewer#hidden-ar-launcher");
    if (!mv) {
      mv = document.createElement("model-viewer");
      mv.id = "hidden-ar-launcher";
      mv.setAttribute("src", cfg.glb);
      mv.setAttribute("ar", "");
      mv.setAttribute("ar-modes", "scene-viewer webxr quick-look");
      mv.setAttribute("style", "width:0; height:0; position:absolute; visibility:hidden;");
      document.body.appendChild(mv);
    } else {
      if (mv.getAttribute("src") !== cfg.glb) {
        mv.setAttribute("src", cfg.glb);
      }
    }

    // Intent URL to launch Scene Viewer app
    const sceneViewerIntent = `intent://arvr.google.com/scene-viewer/1.0?file=${encodeURIComponent(cfg.glb)}&mode=ar_preferred#Intent;scheme=https;package=com.google.android.googlequicksearchbox;action=android.intent.action.VIEW;S.browser_fallback_url=https%3A%2F%2Fplay.google.com%2Fstore%2Fapps%2Fdetails%3Fid%3Dcom.google.ar.core;end;`;

    arBtn.innerHTML = `<button aria-label="View ${cfg.title} in AR">${imgHTML}</button>`;
    const btn = arBtn.querySelector("button");
    btn.style.cursor = "pointer";

    btn.addEventListener("click", async () => {
      fallback.textContent = "";

      // Try intent URL first
      window.location = sceneViewerIntent;

      // After delay, try model-viewer fallback
      setTimeout(async () => {
        try {
          if (mv && mv.enterAR) {
            const canAR = await mv.canActivateAR;
            if (canAR) {
              await mv.enterAR();
              fallback.textContent = "";
              return;
            } else {
              fallback.textContent = "AR is not supported on this Android device/browser.";
            }
          } else {
            fallback.textContent = "AR API not supported in this browser.";
          }
        } catch (err) {
          console.error(err);
          fallback.textContent = "Unable to launch AR viewer on this device/browser.";
        }
      }, 2500);
    });
  } else {
    fallback.textContent = "AR is only supported on iOS and Android devices.";
    arBtn.innerHTML = `<button class="disabled-btn" disabled>AR Not Available</button>`;
  }
})();
