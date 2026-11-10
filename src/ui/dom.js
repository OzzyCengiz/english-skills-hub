const SVG_NS = 'http://www.w3.org/2000/svg';

export function el(tag, attrs = {}, ...children) {
  const element = document.createElement(tag);
  applyAttributes(element, attrs);
  appendChildren(element, children);
  return element;
}

export function svgEl(tag, attrs = {}, ...children) {
  const element = document.createElementNS(SVG_NS, tag);
  for (const [key, value] of Object.entries(attrs)) {
    if (value != null && value !== false) element.setAttribute(key, String(value));
  }
  appendChildren(element, children);
  return element;
}

function applyAttributes(element, attrs) {
  for (const [key, value] of Object.entries(attrs)) {
    if (value == null || value === false) continue;
    if (key === 'class') {
      element.className = Array.isArray(value) ? value.filter(Boolean).join(' ') : value;
    } else if (key === 'dataset') {
      Object.assign(element.dataset, value);
    } else if (key.startsWith('on') && typeof value === 'function') {
      element.addEventListener(key.slice(2).toLowerCase(), value);
    } else if (value === true) {
      element.setAttribute(key, '');
    } else {
      element.setAttribute(key, String(value));
    }
  }
}

function appendChildren(parent, children) {
  for (const child of children.flat(Infinity)) {
    if (child == null || typeof child === 'boolean' || child === '') continue;
    if (typeof child === 'object' && child !== null && 'nodeType' in child) {
      parent.append(child);
    } else if (typeof Node !== 'undefined' && child instanceof Node) {
      parent.append(child);
    } else {
      parent.append(document.createTextNode ? document.createTextNode(String(child)) : String(child));
    }
  }
}

