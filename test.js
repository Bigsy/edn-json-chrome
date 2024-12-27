import { parseEDN, toEDN } from './edn-parser.js';

// Test EDN string
const ednString = '{:name "John" :age 30 :items #{1 2 3}}';

try {
    console.log('Input EDN:', ednString);
    const parsed = parseEDN(ednString);
    console.log('Parsed EDN:', parsed);
    const jsonStr = JSON.stringify(parsed, null, 2);
    console.log('As JSON:', jsonStr);
    
    // Test round-trip conversion
    console.log('\nTesting round-trip conversion:');
    const backToEDN = toEDN(parsed);
    console.log('Back to EDN:', backToEDN);
} catch (error) {
    console.error('Error:', error);
}
