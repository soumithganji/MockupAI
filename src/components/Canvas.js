/**
 * Canvas Component
 * Main canvas with pan/zoom and screen rendering
 */

import { store } from '../services/store.js';
import { renderScreen } from './Screen.js';
import { renderFlowArrows } from './FlowArrows.js';

class Canvas {
    constructor(container) {
        this.container = container;
        this.canvas = container.querySelector('#canvas');
        this.selectionOverlay = container.querySelector('#selection-overlay');

        this.isDragging = false;
        this.isSelecting = false;
        this.dragStart = { x: 0, y: 0 };
        this.selectionStart = { x: 0, y: 0 };

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.subscribeToStore();
        this.render();
    }

    setupEventListeners() {
        // Mouse events for pan
        this.container.addEventListener('mousedown', this.handleMouseDown.bind(this));
        this.container.addEventListener('mousemove', this.handleMouseMove.bind(this));
        this.container.addEventListener('mouseup', this.handleMouseUp.bind(this));
        this.container.addEventListener('mouseleave', this.handleMouseUp.bind(this));

        // Wheel for zoom
        this.container.addEventListener('wheel', this.handleWheel.bind(this), { passive: false });

        // Double click to reset view
        this.container.addEventListener('dblclick', this.handleDoubleClick.bind(this));

        // Keyboard shortcuts
        document.addEventListener('keydown', this.handleKeyDown.bind(this));
    }

    subscribeToStore() {
        store.subscribe((state, oldState) => {
            // Update zoom/pan
            if (state.zoom !== oldState.zoom || state.pan !== oldState.pan) {
                this.updateTransform();
            }

            // Update tool cursor
            if (state.currentTool !== oldState.currentTool) {
                this.updateCursor();
            }

            // Re-render on mockup or selection change
            if (state.mockup !== oldState.mockup ||
                state.selectedScreens !== oldState.selectedScreens ||
                state.selectedElements !== oldState.selectedElements) {
                this.render();
            }
        });
    }

    handleMouseDown(e) {
        if (e.target.closest('.screen-wrapper') || e.target.closest('.ui-element')) {
            // Handle element/screen click
            this.handleElementClick(e);
            return;
        }

        const tool = store.getTool();

        if (tool === 'pan' || e.button === 1 || (e.button === 0 && e.altKey)) {
            // Start panning
            this.isDragging = true;
            this.dragStart = { x: e.clientX, y: e.clientY };
            this.canvas.style.cursor = 'grabbing';
        } else if (tool === 'select') {
            // Start circle selection
            this.isSelecting = true;
            const rect = this.container.getBoundingClientRect();
            this.selectionStart = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            };
            this.canvas.classList.add('selecting');
        }
    }

    handleMouseMove(e) {
        if (this.isDragging) {
            const dx = e.clientX - this.dragStart.x;
            const dy = e.clientY - this.dragStart.y;

            const currentPan = store.getPan();
            store.setPan({
                x: currentPan.x + dx,
                y: currentPan.y + dy
            });

            this.dragStart = { x: e.clientX, y: e.clientY };
        } else if (this.isSelecting) {
            const rect = this.container.getBoundingClientRect();
            const currentPos = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            };

            this.drawSelectionCircle(this.selectionStart, currentPos);
        }
    }

    handleMouseUp(e) {
        if (this.isDragging) {
            this.isDragging = false;
            this.updateCursor();
        }

        if (this.isSelecting) {
            this.isSelecting = false;
            this.canvas.classList.remove('selecting');

            const rect = this.container.getBoundingClientRect();
            const endPos = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            };

            this.finishSelection(this.selectionStart, endPos);
            this.clearSelectionCircle();
        }
    }

    handleWheel(e) {
        e.preventDefault();

        const delta = e.deltaY > 0 ? 0.9 : 1.1;
        const newZoom = store.getZoom() * delta;

        // Zoom towards cursor position
        const rect = this.container.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const pan = store.getPan();
        const zoom = store.getZoom();

        // Calculate new pan to zoom towards cursor
        const newPanX = mouseX - (mouseX - pan.x) * (newZoom / zoom);
        const newPanY = mouseY - (mouseY - pan.y) * (newZoom / zoom);

        store.setZoom(newZoom);
        store.setPan({ x: newPanX, y: newPanY });
    }

    handleDoubleClick(e) {
        if (!e.target.closest('.screen-wrapper')) {
            this.fitView();
        }
    }

    handleKeyDown(e) {
        // Tool shortcuts
        if (e.key === 'h' || e.key === 'H') {
            store.setTool('pan');
        } else if (e.key === 'v' || e.key === 'V') {
            store.setTool('select');
        } else if (e.key === 'Escape') {
            store.clearSelection();
        } else if (e.key === '0' && (e.metaKey || e.ctrlKey)) {
            e.preventDefault();
            store.resetView();
        }
    }

    handleElementClick(e) {
        const elementEl = e.target.closest('.ui-element');
        const screenEl = e.target.closest('.screen-wrapper');

        if (!screenEl) return;

        const screenId = screenEl.dataset.screenId;
        const addToSelection = e.shiftKey || e.metaKey || e.ctrlKey;

        if (elementEl) {
            const elementId = elementEl.dataset.elementId;
            store.selectElement(screenId, elementId, addToSelection);
        } else {
            store.selectScreen(screenId, addToSelection);
        }

        e.stopPropagation();
    }

    drawSelectionCircle(start, end) {
        const centerX = (start.x + end.x) / 2;
        const centerY = (start.y + end.y) / 2;
        const radius = Math.sqrt(
            Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2)
        ) / 2;

        this.selectionOverlay.innerHTML = `
      <ellipse 
        class="selection-circle"
        cx="${centerX}" 
        cy="${centerY}" 
        rx="${radius}" 
        ry="${radius}"
      />
    `;
    }

    clearSelectionCircle() {
        this.selectionOverlay.innerHTML = '';
    }

    finishSelection(start, end) {
        const centerX = (start.x + end.x) / 2;
        const centerY = (start.y + end.y) / 2;
        const radius = Math.sqrt(
            Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2)
        ) / 2;

        if (radius < 10) return; // Ignore tiny selections

        const zoom = store.getZoom();
        const pan = store.getPan();

        // Find elements within the selection circle
        const selectedItems = [];
        const mockup = store.getMockup();

        if (!mockup) return;

        mockup.screens.forEach(screen => {
            // Check if screen center is within selection
            const screenX = (screen.position.x + 140) * zoom + pan.x; // 140 = half screen width
            const screenY = (screen.position.y + 300) * zoom + pan.y; // 300 = half screen height

            const distToScreen = Math.sqrt(
                Math.pow(screenX - centerX, 2) + Math.pow(screenY - centerY, 2)
            );

            if (distToScreen <= radius) {
                selectedItems.push({ type: 'screen', id: screen.id });
            }

            // Check elements
            screen.elements.forEach((element, idx) => {
                const elemY = (screen.position.y + 80 + idx * 60) * zoom + pan.y;
                const elemX = screenX;

                const distToElem = Math.sqrt(
                    Math.pow(elemX - centerX, 2) + Math.pow(elemY - centerY, 2)
                );

                if (distToElem <= radius) {
                    selectedItems.push({
                        type: 'element',
                        screenId: screen.id,
                        id: element.id
                    });
                }
            });
        });

        if (selectedItems.length > 0) {
            store.selectMultiple(selectedItems);
        }
    }

    updateTransform() {
        const { zoom, pan } = store.getState();
        this.canvas.style.transform = `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`;

        // Update zoom display
        const zoomLevel = document.getElementById('zoom-level');
        if (zoomLevel) {
            zoomLevel.textContent = `${Math.round(zoom * 100)}%`;
        }
    }

    updateCursor() {
        const tool = store.getTool();
        this.canvas.style.cursor = tool === 'pan' ? 'grab' : 'crosshair';
    }

    fitView() {
        const mockup = store.getMockup();
        if (!mockup || !mockup.screens.length) {
            store.resetView();
            return;
        }

        // Calculate bounding box
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

        mockup.screens.forEach(screen => {
            minX = Math.min(minX, screen.position.x);
            minY = Math.min(minY, screen.position.y);
            maxX = Math.max(maxX, screen.position.x + 280);
            maxY = Math.max(maxY, screen.position.y + 600);
        });

        const contentWidth = maxX - minX + 200;
        const contentHeight = maxY - minY + 200;

        const containerRect = this.container.getBoundingClientRect();

        const scaleX = containerRect.width / contentWidth;
        const scaleY = containerRect.height / contentHeight;
        const zoom = Math.min(scaleX, scaleY, 1) * 0.9;

        const panX = (containerRect.width - contentWidth * zoom) / 2 - minX * zoom + 100 * zoom;
        const panY = (containerRect.height - contentHeight * zoom) / 2 - minY * zoom + 100 * zoom;

        store.setZoom(zoom);
        store.setPan({ x: panX, y: panY });
    }

    render() {
        const mockup = store.getMockup();

        if (!mockup || !mockup.screens) {
            this.canvas.innerHTML = `
        <div class="canvas-empty">
          <p>Describe your app to generate mockups</p>
        </div>
      `;
            return;
        }

        // Render screens
        let html = '';
        mockup.screens.forEach(screen => {
            html += renderScreen(screen);
        });

        // Render flow arrows
        html += renderFlowArrows(mockup.screens, mockup.flows || []);

        this.canvas.innerHTML = html;
    }
}

export function initCanvas(container) {
    return new Canvas(container);
}

export default Canvas;
