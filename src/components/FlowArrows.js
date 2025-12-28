/**
 * Flow Arrows Component
 * Renders SVG arrows between connected screens - Enhanced wireframe style
 */

export function renderFlowArrows(screens, flows) {
  if (!flows || flows.length === 0) return '';

  const screenPositions = {};
  screens.forEach(screen => {
    screenPositions[screen.id] = {
      x: screen.position.x,
      y: screen.position.y,
      centerX: screen.position.x + 140, // Center of screen (280/2)
      centerY: screen.position.y + 300, // Center of screen (600/2)
      right: screen.position.x + 280,
      bottom: screen.position.y + 600
    };
  });

  let arrowsHtml = `
    <svg class="flow-arrows" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; overflow: visible;">
      <defs>
        <!-- Arrow marker -->
        <marker 
          id="arrowhead" 
          markerWidth="12" 
          markerHeight="12" 
          refX="10" 
          refY="6" 
          orient="auto"
          markerUnits="userSpaceOnUse"
        >
          <path d="M 0 0 L 12 6 L 0 12 L 3 6 Z" fill="#8B5CF6"/>
        </marker>
        
        <!-- Glowing arrow marker -->
        <marker 
          id="arrowhead-glow" 
          markerWidth="16" 
          markerHeight="16" 
          refX="12" 
          refY="8" 
          orient="auto"
          markerUnits="userSpaceOnUse"
        >
          <path d="M 0 0 L 16 8 L 0 16 L 4 8 Z" fill="#8B5CF6" opacity="0.3" filter="blur(2px)"/>
        </marker>
        
        <!-- Gradient for arrows -->
        <linearGradient id="arrow-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#8B5CF6"/>
          <stop offset="100%" stop-color="#06B6D4"/>
        </linearGradient>
        
        <!-- Filter for glow effect -->
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
  `;

  flows.forEach((flow, idx) => {
    const fromPos = screenPositions[flow.from];
    const toPos = screenPositions[flow.to];

    if (!fromPos || !toPos) return;

    // Determine arrow direction and calculate points
    const deltaX = toPos.centerX - fromPos.centerX;
    const deltaY = toPos.centerY - fromPos.centerY;

    let startX, startY, endX, endY, controlX1, controlY1, controlX2, controlY2;

    // Determine if horizontal, vertical, or diagonal flow
    const isHorizontal = Math.abs(deltaX) > Math.abs(deltaY);

    if (isHorizontal && deltaX > 0) {
      // Flow to the right
      startX = fromPos.right + 10;
      startY = fromPos.centerY;
      endX = toPos.x - 20;
      endY = toPos.centerY;

      const midX = (startX + endX) / 2;
      controlX1 = midX;
      controlY1 = startY;
      controlX2 = midX;
      controlY2 = endY;
    } else if (isHorizontal && deltaX < 0) {
      // Flow to the left
      startX = fromPos.x - 10;
      startY = fromPos.centerY;
      endX = toPos.right + 20;
      endY = toPos.centerY;

      const midX = (startX + endX) / 2;
      controlX1 = midX;
      controlY1 = startY;
      controlX2 = midX;
      controlY2 = endY;
    } else if (deltaY > 0) {
      // Flow downward
      startX = fromPos.centerX;
      startY = fromPos.bottom + 40;
      endX = toPos.centerX;
      endY = toPos.y - 20;

      const midY = (startY + endY) / 2;
      controlX1 = startX;
      controlY1 = midY;
      controlX2 = endX;
      controlY2 = midY;
    } else {
      // Flow upward
      startX = fromPos.centerX;
      startY = fromPos.y - 40;
      endX = toPos.centerX;
      endY = toPos.bottom + 20;

      const midY = (startY + endY) / 2;
      controlX1 = startX;
      controlY1 = midY;
      controlX2 = endX;
      controlY2 = midY;
    }

    const pathD = `M ${startX} ${startY} C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${endX} ${endY}`;

    // Calculate label position (midpoint of curve)
    const labelX = (startX + endX) / 2;
    const labelY = (startY + endY) / 2 - 15;

    const label = flow.label || '';
    const flowType = flow.type || 'tap';
    const typeIcon = flowType === 'tap' ? '👆' : flowType === 'swipe' ? '👉' : flowType === 'submit' ? '✓' : '→';

    arrowsHtml += `
      <g class="flow-arrow" data-from="${flow.from}" data-to="${flow.to}">
        <!-- Glow effect path -->
        <path 
          d="${pathD}" 
          stroke="url(#arrow-gradient)"
          stroke-width="8"
          fill="none"
          opacity="0.15"
          stroke-linecap="round"
        />
        
        <!-- Main path with dashes -->
        <path 
          d="${pathD}" 
          stroke="url(#arrow-gradient)"
          stroke-width="3"
          fill="none"
          stroke-dasharray="12,6"
          stroke-linecap="round"
          marker-end="url(#arrowhead)"
          filter="url(#glow)"
        >
          <animate 
            attributeName="stroke-dashoffset" 
            from="0" 
            to="-18" 
            dur="1s" 
            repeatCount="indefinite"
          />
        </path>
        
        ${label ? `
          <!-- Label background -->
          <rect 
            x="${labelX - (label.length * 3.5) - 16}" 
            y="${labelY - 10}" 
            width="${label.length * 7 + 32}" 
            height="22"
            rx="11"
            fill="#1a1a25"
            stroke="#8B5CF6"
            stroke-width="1"
            opacity="0.95"
          />
          
          <!-- Label text -->
          <text 
            x="${labelX}" 
            y="${labelY + 4}"
            fill="#a1a1aa"
            font-size="11"
            font-family="Inter, sans-serif"
            text-anchor="middle"
            font-weight="500"
          >${typeIcon} ${label}</text>
        ` : ''}
      </g>
    `;
  });

  arrowsHtml += '</svg>';

  return arrowsHtml;
}

export default renderFlowArrows;
