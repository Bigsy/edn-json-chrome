import { parseEDN, toEDN } from './edn-parser.js';

function ednToJson(ednString) {
  ednString = ednString || '';
  try {
    if (!ednString.trim()) {
      return '';
    }
    const parsed = parseEDN(ednString);
    return JSON.stringify(parsed);
  } catch (error) {
    console.error('EDN parsing error:', error);
    return `Error: ${error.message}`;
  }
}

function jsonToEdn(jsonString) {
  jsonString = jsonString || '';
  try {
    if (!jsonString.trim()) {
      return '';
    }
    const parsedJson = JSON.parse(jsonString);
    return toEDN(parsedJson);
  } catch (error) {
    console.error('JSON parsing error:', error);
    return `Error: ${error.message}`;
  }
}

function prettyPrint(content) {
  // Try to parse as JSON first
  try {
    const parsedJson = JSON.parse(content);
    return JSON.stringify(parsedJson, null, 2);
  } catch (jsonError) {
    // If not JSON, try to parse as EDN
    try {
      const parsedEDN = parseEDN(content);
      if (parsedEDN !== content) { // Only format if it was valid EDN
        return formatEDN(parsedEDN);
      }
      return content; // Return original if not valid EDN
    } catch (ednError) {
      return content; // Return original if neither JSON nor EDN
    }
  }
}

function formatEDN(obj, indent = 0) {
  const spaces = ' '.repeat(indent);
  
  if (obj === null) return 'nil';
  if (typeof obj === 'boolean') return obj.toString();
  if (typeof obj === 'number') return obj.toString();
  if (typeof obj === 'string') return `"${obj}"`;
  
  if (Array.isArray(obj)) {
    if (obj.length === 0) return '[]';
    const items = obj.map(item => formatEDN(item, indent + 2));
    return `[\n${spaces}  ${items.join(`\n${spaces}  `)}\n${spaces}]`;
  }
  
  if (obj instanceof Set) {
    if (obj.size === 0) return '#{}';
    const items = Array.from(obj).map(item => formatEDN(item, indent + 2));
    return `#{\n${spaces}  ${items.join(`\n${spaces}  `)}\n${spaces}}`;
  }
  
  if (typeof obj === 'object') {
    const entries = Object.entries(obj);
    if (entries.length === 0) return '{}';
    const pairs = entries.map(([k, v]) => {
      const key = k.startsWith(':') ? k : `:${k}`;
      return `${key} ${formatEDN(v, indent + 2)}`;
    });
    return `{\n${spaces}  ${pairs.join(`\n${spaces}  `)}\n${spaces}}`;
  }
  
  return obj.toString();
}

document.addEventListener('DOMContentLoaded', function() {
  const inputEditor = CodeMirror.fromTextArea(document.getElementById('ednInput'), {
    mode: "clojure",
    lineNumbers: true,
    theme: "monokai",
    lineWrapping: true,
    autoCloseBrackets: true,
    matchBrackets: true,
    styleActiveLine: true,
    height: "240px"  // Updated height for input editor
  });

  const outputEditor = CodeMirror.fromTextArea(document.getElementById('jsonOutput'), {
    mode: { 
      name: "javascript",
      json: true,
      statementIndent: 2
    },
    lineNumbers: true,
    theme: "monokai",
    lineWrapping: true,
    matchBrackets: true,
    styleActiveLine: true,
    height: "240px"  // Updated height for output editor
  });

  // Simplified update output function
  function updateOutput(result) {
    if (outputEditor.getValue() !== result) {
      outputEditor.setValue(result);
    }
  }

  // Handle EDN to JSON conversion
  inputEditor.on('change', function() {
    const edn = inputEditor.getValue();
    if (!edn.trim()) {
      updateOutput('');
      return;
    }
    const json = ednToJson(edn);
    updateOutput(prettyPrint(json));
    
    // Format the EDN input
    try {
      const parsedEDN = parseEDN(edn);
      if (parsedEDN !== edn) {
        const formattedEDN = prettyPrint(edn);
        if (inputEditor.getValue() !== formattedEDN) {
          inputEditor.setValue(formattedEDN);
        }
      }
    } catch (error) {
      // Keep original EDN if formatting fails
    }
  });

  // Handle JSON to EDN conversion
  outputEditor.on('change', function() {
    const json = outputEditor.getValue() || '';
    if (!json.trim()) {
      inputEditor.setValue('');
      return;
    }
    try {
      const parsedJson = JSON.parse(json);
      const edn = jsonToEdn(json);
      const formattedEDN = prettyPrint(edn);
      if (inputEditor.getValue() !== formattedEDN) {
        inputEditor.setValue(formattedEDN);
      }
    } catch (err) {
      // Let the user continue typing partial JSON
    }
  });

  // Only handle copy button functionality
  document.querySelectorAll('.copy-button').forEach(button => {
    button.addEventListener('click', function() {
      const targetId = this.getAttribute('data-target');
      let content = '';
      if (targetId === 'ednInput') {
        content = inputEditor.getValue();
      } else if (targetId === 'jsonOutput') {
        content = outputEditor.getValue();
      }
      navigator.clipboard.writeText(content).then(() => {
        const originalText = this.textContent;
        this.textContent = 'Copied!';
        setTimeout(() => {
          this.textContent = originalText;
        }, 1500);
      }).catch(err => {
        console.error('Failed to copy text:', err);
      });
    });
  });
});
