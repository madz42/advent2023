const { readInputFile, splitByLine } = require('../utils');

let [workflows, parts] = readInputFile(!!process.argv[2] ? process.argv[2] : 'data').split('\n\n');

let rulesBook = {};
splitByLine(workflows).forEach((element) => {
  let [label, rules] = element.split('{');
  rules = rules.slice(0, rules.length - 1).split(',');
  const final = rules[rules.length - 1];
  rules.length = rules.length - 1;
  rules = rules.map((rule) => {
    const [left, right] = rule.split(':');
    return {
      category: left[0],
      compare: left[1] === '<' ? 'LESS' : 'MORE',
      value: parseInt(left.slice(2)),
      goto: right,
    };
  });
  rulesBook[label] = { rules, final };
});
parts = splitByLine(parts).map((line) => {
  let part = {};
  const categories = line.slice(1, line.length - 1).split(',');
  for (const cat of categories) part[cat[0]] = parseInt(cat.slice(2));
  return part;
});

// 1
const sendPartTo = (rule, part) => {
  for (const curRule of rulesBook[rule].rules) {
    if (curRule.compare === 'LESS') {
      if (part[curRule.category] < curRule.value)
        return curRule.goto === 'A' || curRule.goto === 'R' ? curRule.goto : sendPartTo(curRule.goto, part);
    } else {
      if (part[curRule.category] > curRule.value)
        return curRule.goto === 'A' || curRule.goto === 'R' ? curRule.goto : sendPartTo(curRule.goto, part);
    }
  }
  if (rulesBook[rule].final === 'A' || rulesBook[rule].final === 'R') return rulesBook[rule].final;
  return sendPartTo(rulesBook[rule].final, part);
};

const result = [];
parts.forEach((part) => {
  if (sendPartTo('in', part) === 'A') result.push(Object.values(part).reduce((acc, val) => acc + val, 0));
});
console.log(
  'PART1:',
  result.reduce((acc, val) => acc + val, 0)
);

// 2
const perfectPart = { x: [1, 4000], m: [1, 4000], a: [1, 4000], s: [1, 4000] };

const followRule = (rule, part) => {
  if (rule === 'R') return 0;
  if (rule === 'A')
    return (
      (part.x[1] - part.x[0] + 1) *
      (part.m[1] - part.m[0] + 1) *
      (part.a[1] - part.a[0] + 1) *
      (part.s[1] - part.s[0] + 1)
    );
  const res = [];
  let antiPart = { ...part };
  for (const i in rulesBook[rule].rules) {
    const curRule = rulesBook[rule].rules[i];
    let newPart = { ...antiPart };
    if (curRule.compare === 'LESS') {
      newPart[curRule.category] = [newPart[curRule.category][0], curRule.value - 1];
      antiPart[curRule.category] = [curRule.value, antiPart[curRule.category][1]];
    } else {
      newPart[curRule.category] = [curRule.value + 1, newPart[curRule.category][1]];
      antiPart[curRule.category] = [antiPart[curRule.category][0], curRule.value];
    }
    res.push(followRule(curRule.goto, newPart));
  }
  //go final antipart
  res.push(followRule(rulesBook[rule].final, antiPart));
  return res.reduce((acc, val) => acc + val, 0);
};

console.log('PART2:', followRule('in', perfectPart));
