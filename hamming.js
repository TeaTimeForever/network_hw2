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


function test(word) {
  let res = code(word);

  // generate test cases
  let tests = [res];
  for(let i = 1; i < 4; i++) {
    tests.push(replaceSymbol(res, i, res[i] === '1'? '0' : '1'));
  }

  // check each test case
  for(let testWord of tests) {
    let isWordCorrect = testWord === countControlBits(testWord)
    console.log( (isWordCorrect? 'correct ' : 'error ') + testWord)
  }
}


test('KP')

