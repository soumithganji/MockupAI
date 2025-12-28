/**
 * Element Component
 * Individual UI elements within screens - Enhanced with more element types
 */

import { store } from '../services/store.js';

const icons = {
  search: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>`,
  user: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
  cart: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>`,
  home: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>`,
  menu: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>`,
  back: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>`,
  heart: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`,
  star: `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
  'star-empty': `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
  settings: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`,
  bell: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>`,
  camera: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>`,
  share: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>`,
  edit: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`,
  trash: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>`,
  plus: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
  check: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>`,
  'arrow-right': `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>`,
  image: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>`,
  comment: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
  bookmark: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>`,
  send: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>`,
  chevron: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>`,
};

export function renderElement(element, screenId) {
  const isSelected = store.isElementSelected(screenId, element.id);
  const selectedClass = isSelected ? 'selected' : '';

  // Skip navbar - it's rendered separately
  if (element.type === 'navbar') return '';

  // NEW: Handle dynamic HTML/CSS elements (flexible approach)
  if (element.html) {
    // Inject scoped CSS if provided
    const cssId = `css-${screenId}-${element.id}`;
    if (element.css && !document.getElementById(cssId)) {
      const styleEl = document.createElement('style');
      styleEl.id = cssId;
      styleEl.textContent = element.css;
      document.head.appendChild(styleEl);
    }

    return `
      <div class="ui-element dynamic-element ${selectedClass}" data-element-id="${element.id}">
        ${element.html}
      </div>
    `;
  }

  // LEGACY: Handle predefined element types (backwards compatibility)
  switch (element.type) {
    case 'header-text':
      return `
        <div class="ui-element header-text ${selectedClass}" data-element-id="${element.id}">
          ${element.content?.text || 'Header Text'}
        </div>
      `;

    case 'subheader-text':
      return `
        <div class="ui-element subheader-text ${selectedClass}" data-element-id="${element.id}">
          ${element.content?.text || 'Subheader'}
        </div>
      `;

    case 'body-text':
      return `
        <div class="ui-element body-text ${selectedClass}" data-element-id="${element.id}">
          ${element.content?.text || 'Body text content goes here.'}
        </div>
      `;

    case 'input-field':
      const iconName = element.content?.icon || 'search';
      const icon = icons[iconName] || icons.search;
      return `
        <div class="ui-element input-field ${selectedClass}" data-element-id="${element.id}">
          <span class="icon">${icon}</span>
          <span>${element.content?.placeholder || element.content?.text || 'Search...'}</span>
        </div>
      `;

    case 'button-primary':
      return `
        <div class="ui-element button-primary ${selectedClass}" data-element-id="${element.id}">
          ${element.content?.text || 'Button'}
        </div>
      `;

    case 'button-secondary':
      return `
        <div class="ui-element button-secondary ${selectedClass}" data-element-id="${element.id}">
          ${element.content?.text || 'Secondary'}
        </div>
      `;

    case 'card':
      return `
        <div class="ui-element card ${selectedClass}" data-element-id="${element.id}">
          <div class="card-image"></div>
          <div class="card-title">${element.content?.title || 'Card Title'}</div>
          <div class="card-subtitle">${element.content?.subtitle || 'Card subtitle'}</div>
          ${element.content?.value ? `<div class="card-price">${element.content.value}</div>` : ''}
        </div>
      `;

    case 'list-item':
      return `
        <div class="ui-element list-item ${selectedClass}" data-element-id="${element.id}">
          <div class="avatar"></div>
          <div class="content">
            <div class="title">${element.content?.title || 'List Item'}</div>
            <div class="subtitle">${element.content?.subtitle || 'Item description'}</div>
          </div>
          ${icons.chevron}
        </div>
      `;

    case 'image-placeholder':
      return `
        <div class="ui-element image-placeholder ${selectedClass}" data-element-id="${element.id}">
          ${icons.image}
          <span style="margin-left: 8px;">${element.content?.text || 'Image'}</span>
        </div>
      `;

    case 'divider':
      return `
        <div class="ui-element divider-line" data-element-id="${element.id}"></div>
      `;

    case 'spacer':
      const size = element.content?.size || 'medium';
      const heights = { small: 8, medium: 16, large: 24 };
      return `
        <div class="ui-element" data-element-id="${element.id}" style="height: ${heights[size] || 16}px;"></div>
      `;

    case 'icon-row':
      return `
        <div class="ui-element icon-row ${selectedClass}" data-element-id="${element.id}">
          <button class="icon-action">${icons.heart}<span>Like</span></button>
          <button class="icon-action">${icons.comment}<span>Comment</span></button>
          <button class="icon-action">${icons.share}<span>Share</span></button>
          <button class="icon-action">${icons.bookmark}<span>Save</span></button>
        </div>
      `;

    case 'stats-row':
      const stats = element.content?.items || ['128 Posts', '14.2K Followers', '892 Following'];
      return `
        <div class="ui-element stats-row ${selectedClass}" data-element-id="${element.id}">
          ${stats.map(stat => {
        const parts = stat.split(' ');
        return `<div class="stat"><span class="stat-value">${parts[0]}</span><span class="stat-label">${parts.slice(1).join(' ')}</span></div>`;
      }).join('')}
        </div>
      `;

    case 'avatar-header':
      return `
        <div class="ui-element avatar-header ${selectedClass}" data-element-id="${element.id}">
          <div class="avatar-large"></div>
          <div class="avatar-info">
            <div class="avatar-name">${element.content?.title || 'User Name'}</div>
            <div class="avatar-bio">${element.content?.subtitle || 'User bio goes here'}</div>
          </div>
        </div>
      `;

    case 'tab-bar':
      const tabs = element.content?.items || ['All', 'Popular', 'Recent', 'Nearby'];
      return `
        <div class="ui-element tab-bar ${selectedClass}" data-element-id="${element.id}">
          ${tabs.map((tab, i) => `<button class="tab ${i === 0 ? 'active' : ''}">${tab}</button>`).join('')}
        </div>
      `;

    case 'toggle-item':
      return `
        <div class="ui-element toggle-item ${selectedClass}" data-element-id="${element.id}">
          <div class="toggle-content">
            <div class="toggle-title">${element.content?.title || 'Setting'}</div>
            <div class="toggle-subtitle">${element.content?.subtitle || 'Description'}</div>
          </div>
          <div class="toggle-switch on"></div>
        </div>
      `;

    case 'price-tag':
      return `
        <div class="ui-element price-tag ${selectedClass}" data-element-id="${element.id}">
          <span class="price-value">${element.content?.value || '$99.00'}</span>
          ${element.content?.subtitle ? `<span class="price-original">${element.content.subtitle}</span>` : ''}
        </div>
      `;

    case 'rating':
      const ratingValue = parseFloat(element.content?.value) || 4.5;
      const fullStars = Math.floor(ratingValue);
      const hasHalf = ratingValue % 1 >= 0.5;
      return `
        <div class="ui-element rating ${selectedClass}" data-element-id="${element.id}">
          <div class="stars">
            ${Array(5).fill(0).map((_, i) =>
        i < fullStars ? icons.star : icons['star-empty']
      ).join('')}
          </div>
          <span class="rating-value">${ratingValue}</span>
          <span class="rating-count">(${element.content?.subtitle || '128 reviews'})</span>
        </div>
      `;

    case 'badge':
      return `
        <div class="ui-element badge ${selectedClass}" data-element-id="${element.id}">
          ${element.content?.text || 'New'}
        </div>
      `;

    case 'search-bar':
      return `
        <div class="ui-element search-bar ${selectedClass}" data-element-id="${element.id}">
          ${icons.search}
          <span>${element.content?.placeholder || 'Search...'}</span>
          <div class="search-filter">${icons.menu}</div>
        </div>
      `;

    case 'category-pills':
      const categories = element.content?.items || ['Food', 'Drinks', 'Desserts', 'Snacks'];
      return `
        <div class="ui-element category-pills ${selectedClass}" data-element-id="${element.id}">
          ${categories.map((cat, i) => `<span class="pill ${i === 0 ? 'active' : ''}">${cat}</span>`).join('')}
        </div>
      `;

    case 'product-card':
      return `
        <div class="ui-element product-card ${selectedClass}" data-element-id="${element.id}">
          <div class="product-image"></div>
          <div class="product-info">
            <div class="product-name">${element.content?.title || 'Product Name'}</div>
            <div class="product-desc">${element.content?.subtitle || 'Short description'}</div>
            <div class="product-price">${element.content?.value || '$29.99'}</div>
          </div>
          <button class="add-to-cart">${icons.plus}</button>
        </div>
      `;

    case 'message-bubble':
      const isOwn = element.content?.type === 'sent';
      return `
        <div class="ui-element message-bubble ${isOwn ? 'own' : ''} ${selectedClass}" data-element-id="${element.id}">
          <div class="bubble-content">${element.content?.text || 'Message text'}</div>
          <div class="bubble-time">${element.content?.subtitle || '2:34 PM'}</div>
        </div>
      `;

    case 'cart-item':
      return `
        <div class="ui-element cart-item ${selectedClass}" data-element-id="${element.id}">
          <div class="cart-item-image"></div>
          <div class="cart-item-details">
            <div class="cart-item-name">${element.content?.title || 'Item Name'}</div>
            <div class="cart-item-variant">${element.content?.subtitle || 'Size: M'}</div>
            <div class="cart-item-price">${element.content?.value || '$19.99'}</div>
          </div>
          <div class="cart-item-quantity">
            <button class="qty-btn">−</button>
            <span class="qty-value">${element.content?.quantity || '1'}</span>
            <button class="qty-btn">+</button>
          </div>
          <button class="cart-item-remove">${icons.trash}</button>
        </div>
      `;

    case 'menu-item':
      const menuIcon = element.content?.icon ? (icons[element.content.icon] || icons.settings) : icons.settings;
      return `
        <div class="ui-element menu-item ${selectedClass}" data-element-id="${element.id}">
          <span class="menu-icon">${menuIcon}</span>
          <span class="menu-label">${element.content?.title || 'Menu Item'}</span>
          <span class="menu-arrow">${icons.chevron}</span>
        </div>
      `;

    case 'price-row':
      return `
        <div class="ui-element price-row ${selectedClass}" data-element-id="${element.id}">
          <span class="price-label">${element.content?.title || 'Subtotal'}</span>
          <span class="price-value">${element.content?.value || '$0.00'}</span>
        </div>
      `;

    case 'notification-item':
      return `
        <div class="ui-element notification-item ${selectedClass}" data-element-id="${element.id}">
          <div class="notif-icon">${icons.bell}</div>
          <div class="notif-content">
            <div class="notif-title">${element.content?.title || 'Notification'}</div>
            <div class="notif-text">${element.content?.subtitle || 'Notification description'}</div>
          </div>
          <div class="notif-time">2h</div>
        </div>
      `;

    default:
      return `
        <div class="ui-element body-text ${selectedClass}" data-element-id="${element.id}">
          ${element.content?.text || element.type}
        </div>
      `;
  }
}

export default renderElement;
