/**
 * NVIDIA NIM API Service
 * Handles all communication with NVIDIA NIM LLM endpoints
 */

const NIM_API_BASE = '/api/nvidia/v1';

// System prompt for generating mobile app mockups
const MOCKUP_SYSTEM_PROMPT = `You are an expert UI/UX designer specializing in mobile app design. Your task is to generate HIGHLY DETAILED JSON specifications for mobile app mockup screens based on user descriptions.

IMPORTANT: You must respond ONLY with valid JSON. Do not include any markdown, explanations, or text outside the JSON.

Generate a complete app mockup with the following JSON structure:
{
  "appName": "App Name",
  "screens": [
    {
      "id": "unique-screen-id",
      "name": "Screen Name",
      "position": { "x": 0, "y": 0 },
      "elements": [
        {
          "id": "unique-element-id",
          "type": "header-text|subheader-text|body-text|input-field|button-primary|button-secondary|card|list-item|image-placeholder|navbar|divider|spacer|icon-row|stats-row|avatar-header|tab-bar|toggle-item|price-tag|rating|badge",
          "content": {
            "text": "Display text",
            "placeholder": "For inputs",
            "icon": "search|home|user|cart|menu|back|heart|star|settings|bell|camera|share|edit|trash|plus|check|arrow-right",
            "items": ["For navbar, tabs, or list items"],
            "title": "For cards",
            "subtitle": "For cards and list items",
            "value": "For stats, prices, ratings",
            "image": "avatar|product|banner|icon"
          }
        }
      ]
    }
  ],
  "flows": [
    {
      "from": "screen-id",
      "to": "screen-id",
      "label": "User action description",
      "type": "tap|swipe|submit|navigate"
    }
  ]
}

ELEMENT TYPES (use variety in each screen):
- header-text: Large bold heading (24-28px)
- subheader-text: Medium weight subheading (16-18px)
- body-text: Regular paragraph text (14px)
- input-field: Text input with icon and placeholder
- button-primary: Main action button with gradient
- button-secondary: Secondary outlined button
- card: Content card with image area, title, subtitle, and optional price/rating
- list-item: Row item with avatar/icon, title, subtitle, and chevron
- image-placeholder: Hero image, banner, or product image area
- navbar: Bottom navigation bar (4-5 items with icons)
- divider: Horizontal separator line
- spacer: Vertical spacing (small, medium, large)
- icon-row: Row of action icons (like, comment, share, save)
- stats-row: Stats display (followers, posts, likes with numbers)
- avatar-header: User profile header with avatar, name, bio
- tab-bar: Horizontal tabs for filtering content
- toggle-item: Settings toggle with label and switch
- price-tag: Price display with currency
- rating: Star rating with count
- badge: Status badge or tag

DESIGN REQUIREMENTS:
1. Each screen MUST have 8-15 elements for a realistic, detailed look
2. Include proper visual hierarchy: header → subheader → content → actions
3. Add spacers and dividers between sections for clean layout
4. Use realistic, contextual placeholder text (not "Lorem ipsum")
5. Include a navbar on main screens
6. Add action buttons where users would expect them

FLOW REQUIREMENTS:
1. Create flows for EVERY user action that navigates between screens
2. Use descriptive labels like "Tap product card", "Submit form", "Click profile"
3. Include flow type: tap, swipe, submit, or navigate
4. Create a logical user journey from start to completion

SCREEN POSITIONING:
- Row 1: x=100 (main flow screens)
- Row 2: x=500 (secondary screens)
- Row 3: x=900 (detail/modal screens)
- Vertical spacing: y increments of 750px
- First screen: {x: 100, y: 100}

Create 4-8 screens for a complete user flow with realistic, detailed content.`;

const EDIT_SYSTEM_PROMPT = `You are an expert UI/UX designer. The user has selected elements or screens in a mobile app mockup and wants to make changes.

You will receive:
1. The current mockup JSON
2. Information about what is selected (screens or elements)
3. The user's change request

Respond with the COMPLETE updated mockup JSON that incorporates the requested changes. Only output valid JSON, no explanations.

Keep all unselected elements exactly as they are. Only modify the selected items based on the user's request.`;

class NIMApiService {
  constructor() {
    this.apiKey = localStorage.getItem('nim_api_key') || '';
    this.model = localStorage.getItem('nim_model') || 'meta/llama-3.1-70b-instruct';
  }

  setApiKey(key) {
    this.apiKey = key;
    localStorage.setItem('nim_api_key', key);
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
