let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  document.getElementById('install-btn').style.display = 'block';
});

document.getElementById('install-btn').addEventListener('click', () => {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then(choice => {
      if (choice.outcome === 'accepted') {
        console.log('App installiert');
      }
      deferredPrompt = null;
    });
  } else {
    showInstallInstructions();
  }
});

function showInstallInstructions() {
  const isiOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
  const msg = isiOS
    ? "🍏 iOS: Teilen > 'Zum Homebildschirm'"
    : "📱 Android: Browsermenü > 'Zum Startbildschirm hinzufügen'";
  alert(msg);
}