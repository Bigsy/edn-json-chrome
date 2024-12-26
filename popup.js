function ednToJson(edn) {
  try {
    // Basic EDN parsing (replace with a more robust solution if needed)
    const parsedEdn = eval('(' + edn + ')');
    return JSON.stringify(parsedEdn);
  } catch (error) {
    return 'Invalid EDN';
  }
}

function jsonToEdn(json) {
  try {
    const parsedJson = JSON.parse(json);
    // Basic EDN stringification (replace with a more robust solution if needed)
    return JSON.stringify(parsedJson).replace(/"([^"]+)":/g, '$1: ');
  } catch (error) {
    return 'Invalid JSON';
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
  const ednInput = document.getElementById('ednInput');
  const jsonOutput = document.getElementById('jsonOutput');

  ednInput.addEventListener('input', function() {
    const edn = ednInput.value;
    const json = ednToJson(edn);
    jsonOutput.value = prettyPrint(json);
  });

  jsonOutput.addEventListener('input', function() {
    const json = jsonOutput.value;
    const edn = jsonToEdn(json);
    ednInput.value = prettyPrint(edn);
  });
});