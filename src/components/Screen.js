/**
 * Screen Component
 * Mobile device frame with UI elements
 */

import { store } from '../services/store.js';
import { renderElement } from './Element.js';

export function renderScreen(screen) {
    const isSelected = store.isScreenSelected(screen.id);

    const x = screen.position?.x || 0;
    const y = screen.position?.y || 0;

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
            ${screen.elements.map(el => renderElement(el, screen.id)).join('')}
          </div>
          ${renderNavbar(screen)}
        </div>
      </div>
      <div class="screen-label">${screen.name}</div>
    </div>
  `;
}

function renderNavbar(screen) {
    const navbar = screen.elements.find(el => el.type === 'navbar');
    if (!navbar) return '';

    const items = navbar.content?.items || ['Home', 'Search', 'Cart', 'Profile'];
    const icons = {
        'Home': `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
        'Search': `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>`,
        'Cart': `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>`,
        'Profile': `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
        'Favorites': `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`,
        'Settings': `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`,
        'Messages': `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
        'Notifications': `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>`,
    };

    const defaultIcon = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/></svg>`;

    return `
    <div class="ui-element navbar" data-element-id="${navbar.id}">
      ${items.map((item, idx) => `
        <div class="nav-item ${idx === 0 ? 'active' : ''}">
          ${icons[item] || defaultIcon}
          <span>${item}</span>
        </div>
      `).join('')}
    </div>
  `;
}

export default renderScreen;
