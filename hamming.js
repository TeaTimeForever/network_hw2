function text2Binary(string) {
  return string.split('').map(function (char) {
      return char.charCodeAt(0).toString(2);
  }).join('');
}

function putSymbol(word, index, symb) {
  return word.substr(0, index) + symb + word.substr(index);
}

function replaceSymbol(word, index, symb) {
  return word.substr(0, index) + symb + word.substr(index+1);
}

function initWord(word) {
  let controlBits = [1, 2, 4, 8, 16];
  let res = text2Binary(word);
  for(let bit of controlBits) {
    res = putSymbol(res, bit-1, 0)
  }
  return res;
}

function code(word) {
  console.log('Test for ' +  word + ' (' + text2Binary(word) + ')');
  let binWord = initWord(word)
  return countControlBits(binWord)
}

function countControlBits(binWord) {
  let controlBits = [1, 2, 4, 8, 16];

  for(let bit of controlBits) {
    let onesCount = 0;
    for(let j = bit-1; j < binWord.length; j += bit*2) {
      for(let k = j; k < j + bit && k < binWord.length; k++) {
        if(!controlBits.includes(k+1)) {
          onesCount += parseInt(binWord[k])
        }
      }
    }
    binWord = replaceSymbol(binWord, bit-1, (onesCount%2) == 0? 0 : 1)
  }
  return binWord;
}

function sanitize(coded) {
  let res = coded;
  res = coded.slice(2,3) + coded.slice(3+1, 7) + coded.slice(7+1, 18);
  return String.fromCharCode(parseInt(res.substr(0,7), 2)) + String.fromCharCode(parseInt(res.substr(7,15), 2));
}

function fixError(word) {
  let controlBits = [1, 2, 4, 8, 16];
  let counted = countControlBits(word)
  let wrongBits = []
  for(let bit of controlBits) {
    if(word[bit-1] !== counted[bit-1]) {
      wrongBits.push(bit);
    }
  }
  let errorBit = wrongBits.reduce((acc, v) => acc += v, 0)
  let res = replaceSymbol(word, errorBit-1, (word[errorBit-1] === '0'? '1' : '0'))
  console.error(`Error in ${errorBit} bit. After fix value is ${res} and decoded as ${sanitize(res)}`)
  return res;
}

function test(word) {
  let res = code(word);
  
  // generate test cases
  let tests = [res];
  for(let i = 4; i < 7; i++) {
    tests.push(replaceSymbol(res, i, res[i] === '1'? '0' : '1'));
  }
  
  // check each test case
  for(let testWord of tests) {
    let isWordCorrect = testWord === countControlBits(testWord);
    
    if (isWordCorrect) {
      console.log(`test PASSED: ${testWord}. Decoded as ${sanitize(testWord)}`)
    } else {
      console.log(`test FAILED: ${testWord}. Decoded as ${sanitize(testWord)}`)
      fixError(testWord); 
    }
    console.log('--------')
  }
  console.log()
}


test('KP')
test('LP')
test('sp')
test('oo')
test('Do')


