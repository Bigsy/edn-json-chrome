// Simple EDN parser for basic cases
export function parseEDN(ednString) {
  // Remove whitespace
  ednString = ednString.trim();
  
  // Handle empty input
  if (!ednString) return null;
  
  // Handle strings
  if (ednString.startsWith('"') && ednString.endsWith('"')) {
    return ednString.slice(1, -1);
  }
  
  // Handle numbers
  if (/^-?\d+(\.\d+)?$/.test(ednString)) {
    return parseFloat(ednString);
  }
  
  // Handle booleans
  if (ednString === 'true') return true;
  if (ednString === 'false') return false;
  
  // Handle nil
  if (ednString === 'nil') return null;
  
  // Handle maps
  if (ednString.startsWith('{') && ednString.endsWith('}')) {
    const inner = ednString.slice(1, -1).trim();
    if (!inner) return {};
    
    const result = {};
    let tokens = tokenize(inner);
    
    for (let i = 0; i < tokens.length; i += 2) {
      const key = tokens[i].startsWith(':') ? tokens[i].slice(1) : tokens[i];
      const value = parseEDN(tokens[i + 1]);
      result[key] = value;
    }
    
    return result;
  }
  
  // Handle sets
  if (ednString.startsWith('#{') && ednString.endsWith('}')) {
    const inner = ednString.slice(2, -1).trim();
    if (!inner) return [];
    
    const tokens = tokenize(inner);
    return tokens.map(token => parseEDN(token));
  }
  
  // Handle vectors
  if (ednString.startsWith('[') && ednString.endsWith(']')) {
    const inner = ednString.slice(1, -1).trim();
    if (!inner) return [];
    
    const tokens = tokenize(inner);
    return tokens.map(token => parseEDN(token));
  }
  
  // Handle keywords
  if (ednString.startsWith(':')) {
    return ednString.slice(1);
  }
  
  return ednString;
}

function tokenize(str) {
  const tokens = [];
  let current = '';
  let inString = false;
  let depth = 0;
  
  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    
    if (char === '"' && str[i - 1] !== '\\') {
      inString = !inString;
      current += char;
      continue;
    }
    
    if (inString) {
      current += char;
      continue;
    }
    
    if (char === '{' || char === '[' || char === '(') {
      depth++;
      current += char;
      continue;
    }
    
    if (char === '}' || char === ']' || char === ')') {
      depth--;
      current += char;
      continue;
    }
    
    if ((char === ' ' || char === ',') && depth === 0) {
      if (current) {
        tokens.push(current);
        current = '';
      }
      continue;
    }
    
    current += char;
  }
  
  if (current) {
    tokens.push(current);
  }
  
  return tokens;
}

export function toEDN(obj) {
  if (obj === null) return 'nil';
  if (typeof obj === 'boolean') return obj.toString();
  if (typeof obj === 'number') return obj.toString();
  if (typeof obj === 'string') return `"${obj}"`;
  
  if (Array.isArray(obj)) {
    return `[${obj.map(toEDN).join(' ')}]`;
  }
  
  if (obj instanceof Set) {
    return `#{${Array.from(obj).map(toEDN).join(' ')}}`;
  }
  
  if (typeof obj === 'object') {
    const pairs = Object.entries(obj).map(([k, v]) => {
      const key = k.startsWith(':') ? k : `:${k}`;
      return `${key} ${toEDN(v)}`;
    });
    return `{${pairs.join(' ')}}`;
  }
  
  return obj.toString();
}
