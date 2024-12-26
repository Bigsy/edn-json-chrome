import jsedn from 'jsedn';

// Test EDN string
const ednString = '{:name "John" :age 30 :items #{1 2 3}}';

try {
    console.log('Input EDN:', ednString);
    const parsed = jsedn.parse(ednString);
    console.log('Parsed EDN:', parsed);
    const asJs = jsedn.toJS(parsed);
    console.log('As JS:', asJs);
    const jsonStr = JSON.stringify(asJs, null, 2);
    console.log('As JSON:', jsonStr);
} catch (error) {
    console.error('Error:', error);
}
