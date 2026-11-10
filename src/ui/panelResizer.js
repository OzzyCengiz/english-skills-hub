const RESIZER_STORAGE_KEY = 'lastbreath_panel_sizes';

function loadSizes() {
  try {
    const raw = localStorage.getItem(RESIZER_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveSizes(sizes) {
  try {
    localStorage.setItem(RESIZER_STORAGE_KEY, JSON.stringify(sizes));
  } catch {}
}

export function initPanelResizers() {
  const deckGrid = document.querySelector('.deck-grid');
  if (!deckGrid) return;

  const resizerLeft = document.getElementById('resizer-left');
  const resizerRight = document.getElementById('resizer-right');
  const resizerLog = document.getElementById('resizer-log');
  const resizerMapDossier = document.getElementById('resizer-map-dossier');
  const paneMap = document.querySelector('.pane-map');

  const sizes = loadSizes();

  // If previous saved sizes were from the old cramped layout, migrate them to spacious bounds
  if (sizes.leftWidth && sizes.leftWidth < 320) delete sizes.leftWidth;
  if (sizes.rightWidth && sizes.rightWidth < 460) delete sizes.rightWidth;
  if (sizes.logHeight && sizes.logHeight > 160) sizes.logHeight = 140;

  // Apply saved sizes on init
  if (sizes.leftWidth && sizes.leftWidth >= 280) {
    deckGrid.style.setProperty('--deck-left-w', `${sizes.leftWidth}px`);
  }
  if (sizes.rightWidth && sizes.rightWidth >= 360) {
    deckGrid.style.setProperty('--deck-right-w', `${sizes.rightWidth}px`);
  }
  if (sizes.logHeight && sizes.logHeight >= 70) {
    deckGrid.style.setProperty('--deck-log-h', `${sizes.logHeight}px`);
  }
  if (paneMap) {
    if (sizes.mapStageHeight && sizes.mapStageHeight >= 100) {
      paneMap.style.setProperty('--map-stage-h', `${sizes.mapStageHeight}px`);
    }
    if (sizes.mapStageWidth && sizes.mapStageWidth >= 120) {
      paneMap.style.setProperty('--map-stage-w', `${sizes.mapStageWidth}px`);
    }
  }

  let rafId = null;
  const notifyResize = () => {
    if (rafId) return;
    rafId = requestAnimationFrame(() => {
      rafId = null;
      window.dispatchEvent(new Event('resize'));
    });
  };

  /**
   * Helper to attach pointer drag behavior to a resizer element
   */
  function attachResizer({ el, orientation, onMove, onReset }) {
    if (!el) return;

    el.addEventListener('pointerdown', (event) => {
      // Only primary mouse button or touch
      if (event.button !== 0 && event.pointerType === 'mouse') return;
      event.preventDefault();

      try {
        el.setPointerCapture(event.pointerId);
      } catch {}

      el.classList.add('is-active');
      document.body.classList.add('is-resizing');
      document.body.classList.add(orientation === 'col' ? 'is-resizing-col' : 'is-resizing-row');

      const startX = event.clientX;
      const startY = event.clientY;

      const handlePointerMove = (moveEvt) => {
        if (moveEvt.pointerId !== event.pointerId) return;
        const dx = moveEvt.clientX - startX;
        const dy = moveEvt.clientY - startY;
        onMove(dx, dy, moveEvt);
        notifyResize();
      };

      const handlePointerUp = (upEvt) => {
        if (upEvt.pointerId !== event.pointerId) return;
        el.removeEventListener('pointermove', handlePointerMove);
        el.removeEventListener('pointerup', handlePointerUp);
        el.removeEventListener('pointercancel', handlePointerUp);

        try {
          el.releasePointerCapture(event.pointerId);
        } catch {}

        el.classList.remove('is-active');
        document.body.classList.remove('is-resizing', 'is-resizing-col', 'is-resizing-row');
        saveSizes(sizes);
        notifyResize();
      };

      el.addEventListener('pointermove', handlePointerMove);
      el.addEventListener('pointerup', handlePointerUp);
      el.addEventListener('pointercancel', handlePointerUp);
    });

    el.addEventListener('dblclick', (event) => {
      event.preventDefault();
      onReset();
      saveSizes(sizes);
      notifyResize();
    });
  }

  // 1. Resizer Left (Status column width)
  if (resizerLeft) {
    let startW = 0;
    resizerLeft.addEventListener('pointerdown', () => {
      const statusPane = document.querySelector('.pane-status');
      startW = statusPane ? statusPane.getBoundingClientRect().width : 360;
    });

    attachResizer({
      el: resizerLeft,
      orientation: 'col',
      onMove: (dx) => {
        const gridW = deckGrid.getBoundingClientRect().width;
        const rightPane =
          document.querySelector('.pane-inventory:not(.is-desktop-right-hidden)') ||
          document.querySelector('.pane-craft:not(.is-desktop-right-hidden)') ||
          document.querySelector('.pane-base:not(.is-desktop-right-hidden)') ||
          document.querySelector('.pane-inventory');
        const rightW = rightPane ? rightPane.getBoundingClientRect().width : 500;
        const maxW = Math.max(300, gridW - rightW - 320);
        const newW = Math.min(Math.max(280, Math.round(startW + dx)), maxW);
        sizes.leftWidth = newW;
        deckGrid.style.setProperty('--deck-left-w', `${newW}px`);
      },
      onReset: () => {
        delete sizes.leftWidth;
        deckGrid.style.removeProperty('--deck-left-w');
      },
    });
  }

  // 2. Resizer Right (Inventory / Craft / Base column width)
  if (resizerRight) {
    let startW = 0;
    resizerRight.addEventListener('pointerdown', () => {
      const activeRightPane =
        document.querySelector('.pane-inventory:not(.is-desktop-right-hidden)') ||
        document.querySelector('.pane-craft:not(.is-desktop-right-hidden)') ||
        document.querySelector('.pane-base:not(.is-desktop-right-hidden)') ||
        document.querySelector('.pane-inventory');
      startW = activeRightPane ? activeRightPane.getBoundingClientRect().width : 500;
    });

    attachResizer({
      el: resizerRight,
      orientation: 'col',
      onMove: (dx) => {
        const gridW = deckGrid.getBoundingClientRect().width;
        const leftPane = document.querySelector('.pane-status');
        const leftW = leftPane ? leftPane.getBoundingClientRect().width : 360;
        const maxW = Math.max(400, gridW - leftW - 320);
        const newW = Math.min(Math.max(340, Math.round(startW - dx)), maxW);
        sizes.rightWidth = newW;
        deckGrid.style.setProperty('--deck-right-w', `${newW}px`);
      },
      onReset: () => {
        delete sizes.rightWidth;
        deckGrid.style.removeProperty('--deck-right-w');
      },
    });
  }

  // 3. Resizer Log (Field log height)
  if (resizerLog) {
    let startH = 0;
    resizerLog.addEventListener('pointerdown', () => {
      const logPane = document.querySelector('.pane-log');
      startH = logPane ? logPane.getBoundingClientRect().height : 140;
    });

    attachResizer({
      el: resizerLog,
      orientation: 'row',
      onMove: (_, dy) => {
        const gridH = deckGrid.getBoundingClientRect().height;
        const maxH = Math.max(80, gridH - 180);
        const newH = Math.min(Math.max(70, Math.round(startH - dy)), maxH);
        sizes.logHeight = newH;
        deckGrid.style.setProperty('--deck-log-h', `${newH}px`);
      },
      onReset: () => {
        delete sizes.logHeight;
        deckGrid.style.removeProperty('--deck-log-h');
      },
    });
  }

  // 4. Resizer Map Dossier (Map viewport vs Dossier)
  if (resizerMapDossier && paneMap) {
    let startDim = 0;
    resizerMapDossier.addEventListener('pointerdown', () => {
      const mapStage = document.getElementById('map-viewport');
      if (!mapStage) return;
      const isLandscape = window.matchMedia(
        '(orientation: landscape) and (max-height: 560px) and (max-width: 1023px)',
      ).matches;
      startDim = isLandscape
        ? mapStage.getBoundingClientRect().width
        : mapStage.getBoundingClientRect().height;
    });

    attachResizer({
      el: resizerMapDossier,
      orientation: 'row', // dynamically handles col in landscape
      onMove: (dx, dy) => {
        const mapStage = document.getElementById('map-viewport');
        if (!mapStage) return;
        const isLandscape = window.matchMedia(
          '(orientation: landscape) and (max-height: 560px) and (max-width: 1023px)',
        ).matches;

        if (isLandscape) {
          const totalW = paneMap.getBoundingClientRect().width;
          const maxW = Math.max(140, totalW - 140);
          const newW = Math.min(Math.max(120, Math.round(startDim + dx)), maxW);
          sizes.mapStageWidth = newW;
          paneMap.style.setProperty('--map-stage-w', `${newW}px`);
        } else {
          const totalH = paneMap.getBoundingClientRect().height;
          const maxH = Math.max(120, totalH - 90);
          const newH = Math.min(Math.max(100, Math.round(startDim + dy)), maxH);
          sizes.mapStageHeight = newH;
          paneMap.style.setProperty('--map-stage-h', `${newH}px`);
        }
      },
      onReset: () => {
        const isLandscape = window.matchMedia(
          '(orientation: landscape) and (max-height: 560px) and (max-width: 1023px)',
        ).matches;
        if (isLandscape) {
          delete sizes.mapStageWidth;
          paneMap.style.removeProperty('--map-stage-w');
        } else {
          delete sizes.mapStageHeight;
          paneMap.style.removeProperty('--map-stage-h');
        }
      },
    });
  }

  // Handle window resizing safely
  window.addEventListener('resize', () => {
    if (!window.matchMedia('(min-width: 900px) and (min-height: 500px)').matches) return;
    const gridW = deckGrid.getBoundingClientRect().width;
    const currentLeft = sizes.leftWidth || 280;
    const currentRight = sizes.rightWidth || 320;
    if (currentLeft + currentRight + 280 > gridW) {
      const scale = (gridW - 280) / (currentLeft + currentRight);
      if (scale > 0 && scale < 1) {
        const adjLeft = Math.max(180, Math.round(currentLeft * scale));
        const adjRight = Math.max(200, Math.round(currentRight * scale));
        deckGrid.style.setProperty('--deck-left-w', `${adjLeft}px`);
        deckGrid.style.setProperty('--deck-right-w', `${adjRight}px`);
      }
    }
  });
}
