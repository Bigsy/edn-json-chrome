import { parseEDN, toEDN } from './edn-parser.js';

function ednToJson(ednString) {
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

function prettyPrint(json) {
  try {
    const parsedJson = JSON.parse(json);
    return JSON.stringify(parsedJson, null, 2);
  } catch (error) {
    return json; // Return the original if not valid JSON
  }
}

document.addEventListener('DOMContentLoaded', function() {
  console.log('DOMContentLoaded event fired');
  const ednInput = document.getElementById('ednInput');
  const jsonOutput = document.getElementById('jsonOutput');
  
  if (!ednInput) {
    console.error('Could not find element with ID "ednInput"');
  }
  if (!jsonOutput) {
    console.error('Could not find element with ID "jsonOutput"');
  }

  ednInput.addEventListener('input', function() {
    console.log('Input detected');
    const edn = ednInput.value;
    console.log('EDN input:', edn);
    const json = ednToJson(edn);
    console.log('JSON output:', json);
    jsonOutput.value = prettyPrint(json);
  });

  jsonOutput.addEventListener('input', function() {
    const json = jsonOutput.value;
    const edn = jsonToEdn(json);
    ednInput.value = edn;
  });
});