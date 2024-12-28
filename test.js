import { parseEDN, toEDN } from './edn-parser.js';

// Test EDN string
const ednString = '{:name "John" :age 30 :items #{1 2 3}}';

try {
    const parsed = parseEDN(ednString);
    const jsonStr = JSON.stringify(parsed, null, 2);
    // Test round-trip conversion
    const backToEDN = toEDN(parsed);
} catch (error) {
    console.error('Error:', error);
}
