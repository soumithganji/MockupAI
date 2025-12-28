/**
 * Screen Component
 * Mobile device frame with wireframe elements
 */

import { store } from '../services/store.js';
import { renderWireframeElement } from './WireframeElement.js';

export function renderScreen(screen) {
  const isSelected = store.isScreenSelected(screen.id);

  const x = screen.position?.x || 0;
  const y = screen.position?.y || 0;

  // Filter out navbar from regular elements (render separately at bottom)
  const regularElements = screen.elements.filter(el => el.type !== 'navbar');
  const navbar = screen.elements.find(el => el.type === 'navbar');

  return `
    <div 
      class="screen-wrapper ${isSelected ? 'selected' : ''}"
      data-screen-id="${screen.id}"
      style="left: ${x}px; top: ${y}px;"
    >
      <div class="device-frame iphone">
        <div class="device-screen">
          <div class="dynamic-island"></div>
          <div class="status-bar">
            <span class="time">9:41</span>
            <span class="icons">
              <svg width="17" height="10" viewBox="0 0 17 10" fill="currentColor">
                <path d="M1 4.5C1 3.67 1.67 3 2.5 3h1C4.33 3 5 3.67 5 4.5v4c0 .83-.67 1.5-1.5 1.5h-1C1.67 10 1 9.33 1 8.5v-4z"/>
                <path d="M6 3.5C6 2.67 6.67 2 7.5 2h1C9.33 2 10 2.67 10 3.5v5c0 .83-.67 1.5-1.5 1.5h-1C6.67 10 6 9.33 6 8.5v-5z"/>
                <path d="M11 2.5c0-.83.67-1.5 1.5-1.5h1c.83 0 1.5.67 1.5 1.5v6c0 .83-.67 1.5-1.5 1.5h-1c-.83 0-1.5-.67-1.5-1.5v-6z"/>
              </svg>
              <svg width="15" height="10" viewBox="0 0 15 10" fill="currentColor">
                <path d="M7.5 2C4.5 2 2 4 0 7c2 3 4.5 5 7.5 5S13 10 15 7c-2-3-4.5-5-7.5-5zm0 8C5.5 10 4 8.5 4 7s1.5-3 3.5-3S11 5.5 11 7s-1.5 3-3.5 3z"/>
              </svg>
              <svg width="25" height="10" viewBox="0 0 25 10" fill="currentColor">
                <rect x="0" y="2" width="21" height="7" rx="2" stroke="currentColor" stroke-width="1" fill="none"/>
                <rect x="2" y="4" width="17" height="3" rx="1" fill="currentColor"/>
                <path d="M23 4v3c1 0 2-0.5 2-1.5S24 4 23 4z"/>
              </svg>
            </span>
          </div>
          <div class="screen-content">
            ${regularElements.map(el => renderWireframeElement(el, screen.id)).join('')}
          </div>
          ${navbar ? renderWireframeElement(navbar, screen.id) : ''}
        </div>
      </div>
      <div class="screen-label">${screen.name || 'Untitled'}</div>
    </div>
  `;
}

export default renderScreen;

