function allPossibleCombinations(input, length, curstr) {
  if (curstr.length == length) return [curstr];
  var ret = [];
  for (var i = 0; i < input.length; i++) {
    ret.push.apply(
      ret,
      allPossibleCombinations(input, length, curstr + input[i])
    );
  }
  return ret;
}

const vowels = ["a", "e", "i", "o", "u", "y"];
const input = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
];
const combinations = allPossibleCombinations(input, 4, "");
const atLeastOneVowel = combinations.filter((combination) => {
  return vowels.some((vowel) => {
    return combination.includes(vowel);
  });
});
for (let i = 0; i < 10; i++) {
  const randomIndex = Math.floor(Math.random() * atLeastOneVowel.length);
  console.log(atLeastOneVowel[randomIndex]);
}
