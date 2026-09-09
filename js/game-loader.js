/**
 * JEEP HORROR - Native Iframe Web Game Loader
 * Loads the Godot HTML5 export asynchronously upon player interaction
 */
document.addEventListener('DOMContentLoaded', () => {
  const playBtn = document.getElementById('play-game-btn');
  const placeholder = document.getElementById('game-placeholder');
  const viewport = document.getElementById('game-viewport');
  const fullscreenBtn = document.getElementById('fullscreen-btn');
  const reloadBtn = document.getElementById('reload-btn');

  // Official itch.io HTML5 game embed URL
  const GAME_EMBED_URL = 'https://html-classic.itch.zone/html/18290226/index.html?v=1783773836';

  let gameIframe = null;

  function loadGame() {
    if (gameIframe) return;

    // Create spinner indicator
    const spinner = document.createElement('div');
    spinner.className = 'game-loading-spinner';
    spinner.innerHTML = `
      <div style="color: #ff2a6d; font-weight: bold; font-size: 1.2rem; margin-bottom: 10px;">
        Kumakarga ang Laro / Loading Game...
      </div>
      <div style="color: #8892b0; font-size: 0.9rem;">
        Paghahanda ng jeepney cabin & Godot WebAssembly...
      </div>
    `;
    placeholder.innerHTML = '';
    placeholder.appendChild(spinner);

    // Create iframe
    gameIframe = document.createElement('iframe');
    gameIframe.id = 'game-frame';
    gameIframe.className = 'game-iframe';
    gameIframe.src = GAME_EMBED_URL;
    gameIframe.setAttribute('allow', 'autoplay; fullscreen *; geolocation; microphone; camera; midi; monetization; xr-spatial-tracking; gamepad; gyroscope; accelerometer; xr; cross-origin-isolated; web-share');
    gameIframe.setAttribute('allowfullscreen', 'true');
    gameIframe.setAttribute('webkitallowfullscreen', 'true');
    gameIframe.setAttribute('mozallowfullscreen', 'true');
    gameIframe.setAttribute('scrolling', 'no');
    gameIframe.setAttribute('frameborder', '0');

    gameIframe.onload = () => {
      setTimeout(() => {
        placeholder.style.display = 'none';
        gameIframe.focus();
      }, 500);
    };

    viewport.appendChild(gameIframe);
  }

  if (playBtn) {
    playBtn.addEventListener('click', (e) => {
      e.preventDefault();
      loadGame();
    });
  }

  if (fullscreenBtn) {
    fullscreenBtn.addEventListener('click', () => {
      if (!gameIframe) {
        loadGame();
      }
      const target = document.getElementById('game-stage-wrapper') || viewport;
      if (!document.fullscreenElement) {
        if (target.requestFullscreen) {
          target.requestFullscreen();
        } else if (target.webkitRequestFullscreen) {
          target.webkitRequestFullscreen();
        } else if (target.mozRequestFullScreen) {
          target.mozRequestFullScreen();
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
      }
    });
  }

  if (reloadBtn) {
    reloadBtn.addEventListener('click', () => {
      if (gameIframe) {
        gameIframe.src = GAME_EMBED_URL;
      }
    });
  }
});
