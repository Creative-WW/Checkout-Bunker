(() => {
  const config = window.projectConfig;

  // Cache DOM elements once
  const pageTitle = document.getElementById('page-title');
  const metaDescription = document.getElementById('meta-description');
  const projectTitle = document.getElementById('project-title');
  const footerLogo = document.getElementById('footer-logo');
  const arButton = document.getElementById('ar-button');
  const fallback = document.getElementById('fallback');

  if (!config) {
    console.error("projectConfig is not defined");
    return;
  }

  // Update meta and page content
  document.title = `${config.title} AR`;
  pageTitle.textContent = `${config.title} AR`;
  metaDescription.setAttribute("content", config.description);
  projectTitle.textContent = config.title;

  if (footerLogo && config.logo) {
    footerLogo.src = config.logo;
  }

  // Clean up fallback and arButton content
  fallback.textContent = '';
  arButton.innerHTML = '';

  // Detect platform
  const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
  const isAndroid = /Android/i.test(navigator.userAgent);

  // Create model-viewer element dynamically
  const modelViewer = document.createElement('model-viewer');

  // Set model-viewer attributes based on config
  modelViewer.setAttribute('src', config.glb);
  modelViewer.setAttribute('ios-src', config.usdz);
  modelViewer.setAttribute('alt', config.description || config.title);
  modelViewer.setAttribute('ar', '');
  modelViewer.setAttribute('ar-modes', 'scene-viewer quick-look webxr');
  modelViewer.setAttribute('environment-image', 'neutral');
  modelViewer.setAttribute('auto-rotate', '');
  modelViewer.setAttribute('camera-controls', '');
  modelViewer.setAttribute('poster', config.image);
  modelViewer.style.width = '100%';
  modelViewer.style.height = '100%';
  modelViewer.style.cursor = 'pointer';

  arButton.appendChild(modelViewer);

  // Basic AR support check
  function isARSupported() {
    if (isIOS) return true;
    if (isAndroid) {
      // Check if Android Chrome (basic)
      return /Chrome/.test(navigator.userAgent);
    }
    return false;
  }

  if (!isARSupported()) {
    fallback.textContent = 'AR is only supported on iOS Safari and Android Chrome browsers.';
    modelViewer.style.display = 'none';
  }
})();
