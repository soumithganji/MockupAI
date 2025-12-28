/**
 * NVIDIA NIM API Service
 * Handles all communication with NVIDIA NIM LLM endpoints
 */

const NIM_API_BASE = '/api/nvidia/v1';

// System prompt for generating mobile app mockups
const MOCKUP_SYSTEM_PROMPT = `You are a wireframe designer. Generate JSON specifications for mobile app wireframes using simple primitives.

RESPOND ONLY WITH VALID JSON. No markdown, no explanations.

=== JSON STRUCTURE ===
{
  "appName": "App Name",
  "screens": [
    {
      "id": "screen-1",
      "name": "Screen Name",
      "position": { "x": 0, "y": 0 },
      "elements": [ /* array of elements */ ]
    }
  ],
  "flows": [{ "from": "screen-1", "to": "screen-2", "label": "Tap button", "type": "tap" }]
}

=== WIREFRAME ELEMENTS (only use these) ===

1. TEXT - Any text content
   { "id": "t1", "type": "text", "content": "Hello World", "style": "heading|subheading|body|muted|label" }

2. BUTTON - Clickable button
   { "id": "b1", "type": "button", "content": "Click Me", "variant": "primary|secondary|outline" }

3. INPUT - Text input field
   { "id": "i1", "type": "input", "placeholder": "Enter text...", "icon": "search|user|mail|lock" }

4. IMAGE - Image placeholder
   { "id": "img1", "type": "image", "label": "Profile Photo", "size": "small|medium|large|banner" }

5. ICON - Icon with optional label
   { "id": "ic1", "type": "icon", "name": "heart|star|cart|user|settings|bell|home|search|menu|back|send|plus|trash|edit|check", "label": "Favorites" }

6. BOX - Container for grouping elements (can be nested)
   { "id": "box1", "type": "box", "variant": "card|row|column|highlight", "children": [ /* nested elements */ ] }

7. DIVIDER - Horizontal separator
   { "id": "d1", "type": "divider" }

8. SPACER - Vertical space
   { "id": "s1", "type": "spacer", "size": "small|medium|large" }

9. NAVBAR - Bottom navigation (use once per screen, at the end)
   { "id": "nav", "type": "navbar", "items": ["Home", "Search", "Cart", "Profile"] }

=== BOX VARIANTS ===
- "card": Rounded container with background
- "row": Horizontal layout (items side by side)
- "column": Vertical layout (items stacked)
- "highlight": Accent-colored container

=== EXAMPLES ===

Chat message:
{ "type": "box", "variant": "card", "children": [
  { "type": "text", "content": "Hello! How can I help?", "style": "body" },
  { "type": "text", "content": "10:30 AM", "style": "muted" }
]}

Product card:
{ "type": "box", "variant": "card", "children": [
  { "type": "box", "variant": "row", "children": [
    { "type": "image", "label": "Product", "size": "medium" },
    { "type": "box", "variant": "column", "children": [
      { "type": "text", "content": "Pizza Margherita", "style": "subheading" },
      { "type": "text", "content": "Classic Italian pizza", "style": "muted" },
      { "type": "text", "content": "$12.99", "style": "heading" }
    ]},
    { "type": "button", "content": "Add", "variant": "primary" }
  ]}
]}

Profile header:
{ "type": "box", "variant": "highlight", "children": [
  { "type": "box", "variant": "row", "children": [
    { "type": "image", "label": "Avatar", "size": "medium" },
    { "type": "box", "variant": "column", "children": [
      { "type": "text", "content": "John Doe", "style": "heading" },
      { "type": "text", "content": "john@email.com", "style": "muted" }
    ]},
    { "type": "button", "content": "Edit", "variant": "outline" }
  ]}
]}

=== QUALITY RULES ===
1. Each screen should have 6-15 elements
2. Use realistic content (actual names, text, prices)
3. Nest boxes to create complex layouts
4. Use "row" for horizontal layouts, "column" for vertical
5. Include navbar on main screens
6. End each screen's elements with the navbar

=== SCREEN POSITIONS ===
First: {x:100, y:100}, then x+400 for columns, y+750 for rows

Generate 4-6 screens with nested elements for any app type.`;

const EDIT_SYSTEM_PROMPT = `You are a wireframe designer. Modify the wireframe based on user request.

ELEMENT TYPES: text, button, input, image, icon, box, divider, spacer, navbar
BOX VARIANTS: card, row, column, highlight
Use nested "box" elements with "children" arrays for complex layouts.

Return the COMPLETE updated mockup JSON. Only valid JSON, no explanations.`;


class NIMApiService {
  constructor() {
    // Get API key from environment variable (set in .env file)
    this.apiKey = import.meta.env.VITE_NIM_API_KEY || '';
    this.model = localStorage.getItem('nim_model') || 'meta/llama-3.1-70b-instruct';
  }

  setApiKey(key) {
    // API key is now managed via .env file, this is kept for compatibility
    this.apiKey = key;
  }

  getApiKey() {
    return this.apiKey;
  }

  setModel(model) {
    this.model = model;
    localStorage.setItem('nim_model', model);
  }

  getModel() {
    return this.model;
  }

  hasApiKey() {
    return this.apiKey && this.apiKey.length > 0;
  }

  /**
   * Generate mockup from user prompt
   */
  async generateMockup(userPrompt, onChunk = null) {
    if (!this.hasApiKey()) {
      throw new Error('API key is required. Please add your NVIDIA NIM API key in settings.');
    }

    const messages = [
      { role: 'system', content: MOCKUP_SYSTEM_PROMPT },
      { role: 'user', content: `Create a mobile app mockup for: ${userPrompt}` }
    ];

    return this._streamChat(messages, onChunk);
  }

  /**
   * Edit existing mockup based on selection and request
   */
  async editMockup(currentMockup, selectedItems, userRequest, onChunk = null) {
    if (!this.hasApiKey()) {
      throw new Error('API key is required. Please add your NVIDIA NIM API key in settings.');
    }

    const selectionContext = this._buildSelectionContext(selectedItems);

    const messages = [
      { role: 'system', content: EDIT_SYSTEM_PROMPT },
      {
        role: 'user',
        content: `Current mockup:
${JSON.stringify(currentMockup, null, 2)}

Selected items:
${selectionContext}

User request: ${userRequest}

Please provide the updated mockup JSON.`
      }
    ];

    return this._streamChat(messages, onChunk);
  }

  /**
   * Chat for general questions or feedback
   */
  async chat(messages, onChunk = null) {
    if (!this.hasApiKey()) {
      throw new Error('API key is required. Please add your NVIDIA NIM API key in settings.');
    }

    return this._streamChat(messages, onChunk);
  }

  _buildSelectionContext(selectedItems) {
    if (!selectedItems || selectedItems.length === 0) {
      return 'No specific items selected (apply changes globally)';
    }

    const screens = selectedItems.filter(item => item.type === 'screen');
    const elements = selectedItems.filter(item => item.type === 'element');

    let context = '';

    if (screens.length > 0) {
      context += `Selected screens: ${screens.map(s => s.id).join(', ')}\n`;
    }

    if (elements.length > 0) {
      context += `Selected elements: ${elements.map(e => `${e.screenId}/${e.id}`).join(', ')}`;
    }

    return context;
  }

  async _streamChat(messages, onChunk) {
    const response = await fetch(`${NIM_API_BASE}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: this.model,
        messages: messages,
        stream: true,
        max_tokens: 4096,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error?.message || `API error: ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullContent = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') continue;

          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              fullContent += content;
              if (onChunk) {
                onChunk(content, fullContent);
              }
            }
          } catch (e) {
            // Ignore parse errors for incomplete chunks
          }
        }
      }
    }

    return fullContent;
  }

  /**
   * Parse JSON from LLM response (handles markdown code blocks)
   */
  parseJsonResponse(response) {
    // Try to extract JSON from markdown code blocks
    const jsonMatch = response.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[1].trim());
    }

    // Try to parse the entire response as JSON
    // First, find the first { and last }
    const start = response.indexOf('{');
    const end = response.lastIndexOf('}');

    if (start !== -1 && end !== -1) {
      return JSON.parse(response.slice(start, end + 1));
    }

    throw new Error('Could not parse JSON from response');
  }
}

// Export singleton instance
export const nimApi = new NIMApiService();
export default nimApi;
