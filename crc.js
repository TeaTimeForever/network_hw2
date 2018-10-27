function get_crc(value, divisor) {
  let div_length = divisor.toString(2).length;
  let word = (value << div_length-1);
  while (word.toString(2).length > div_length-1) {
    let partToDivide = parseInt(word.toString(2).slice(0, div_length), 2);
    let nextLeft = (partToDivide.toString(2)[0] === 0)
    ? partToDivide ^ 0
    : partToDivide ^ divisor;
    word = parseInt(nextLeft.toString(2) + word.toString(2).slice(div_length, word.length), 2);
  }
  return word.toString(2);
}

function generateError(word, n) {
  return word.substr(0, n) + 
              (word[n] === '1'? '0' : '1') + 
              word.substr(n + 1);
}

function test(word, divisor) {
  let crc = get_crc(word, divisor);
  let tests = [parseInt(word.toString(2) + crc, 2)];
  for(let i = 1; i < 4; i++) {
    let incorrectMessage = parseInt(generateError(word.toString(2), i) + crc, 2);
    tests.push(incorrectMessage);
  }
  console.log('Tests for: word = ' + word.toString(2) + ', divisor = ' + divisor.toString(2))
  tests.map((testWord) => {
    let ans = get_crc(testWord, divisor) === "0";
    console.log( (ans? 'correct ' : 'error ') + testWord.toString(2))
  })
  console.log()
} 

test(0b1101101, 0b10101)
test(0b1001011, 0b11001)
test(0b100000, 0b11111)
test(0b1111111, 0b11101)
test(0b1111100, 0b10001)