const SEQUENCE_RULES = [
  {
    name: 'Arithmetic',
    generate: (random) => {
      const start = Math.floor(random() * 20) + 1;
      const diff = Math.floor(random() * 10) + 2;
      const len = 6;
      const seq = [];
      for (let i = 0; i < len; i++) {
        seq.push(start + diff * i);
      }
      const answer = start + diff * len;
      return {
        sequence: seq,
        answer,
        rule: `Add ${diff} to each term`,
        hints: [
          'Look at the difference between consecutive terms',
          `The common difference is ${diff}`,
          `The next term is ${seq[len - 1]} + ${diff}`,
        ],
      };
    },
  },
  {
    name: 'Geometric',
    generate: (random) => {
      const start = Math.floor(random() * 5) + 2;
      const ratio = Math.floor(random() * 3) + 2;
      const len = 5;
      const seq = [];
      for (let i = 0; i < len; i++) {
        seq.push(start * Math.pow(ratio, i));
      }
      const answer = start * Math.pow(ratio, len);
      return {
        sequence: seq,
        answer,
        rule: `Multiply each term by ${ratio}`,
        hints: [
          'Look at the ratio between consecutive terms',
          `Each term is multiplied by ${ratio}`,
          `The next term is ${seq[len - 1]} × ${ratio}`,
        ],
      };
    },
  },
  {
    name: 'Fibonacci-like',
    generate: (random) => {
      const a = Math.floor(random() * 5) + 1;
      const b = Math.floor(random() * 5) + 1;
      const seq = [a, b];
      for (let i = 2; i < 7; i++) {
        seq.push(seq[i - 1] + seq[i - 2]);
      }
      const answer = seq[seq.length - 1] + seq[seq.length - 2];
      const display = seq.slice(0, 6);
      return {
        sequence: display,
        answer,
        rule: 'Each term is the sum of the two preceding terms',
        hints: [
          'Try adding pairs of consecutive numbers',
          `${display[0]} + ${display[1]} = ${display[2]}`,
          `The next term is ${display[4]} + ${display[5]}`,
        ],
      };
    },
  },
  {
    name: 'Square Numbers',
    generate: (random) => {
      const offset = Math.floor(random() * 5);
      const len = 6;
      const seq = [];
      for (let i = 1; i <= len; i++) {
        seq.push((i + offset) * (i + offset));
      }
      const answer = (len + 1 + offset) * (len + 1 + offset);
      return {
        sequence: seq,
        answer,
        rule: `Square numbers starting from ${1 + offset}`,
        hints: [
          'These are perfect squares',
          `The first term is ${1 + offset}²`,
          `The next square is ${len + 1 + offset}²`,
        ],
      };
    },
  },
  {
    name: 'Alternating',
    generate: (random) => {
      const base = Math.floor(random() * 10) + 5;
      const add = Math.floor(random() * 5) + 2;
      const sub = Math.floor(random() * 3) + 1;
      const len = 7;
      const seq = [base];
      for (let i = 1; i < len; i++) {
        seq.push(i % 2 === 1 ? seq[i - 1] + add : seq[i - 1] - sub);
      }
      const answer = len % 2 === 1 ? seq[len - 1] + add : seq[len - 1] - sub;
      return {
        sequence: seq,
        answer,
        rule: `Alternately add ${add} and subtract ${sub}`,
        hints: [
          'The pattern alternates between two operations',
          `One operation adds ${add}`,
          `The other subtracts ${sub}`,
        ],
      };
    },
  },
];

export function generateSequencePuzzle(random) {
  const ruleIndex = Math.floor(random() * SEQUENCE_RULES.length);
  const rule = SEQUENCE_RULES[ruleIndex];
  const result = rule.generate(random);

  return {
    question: `What comes next in the sequence?\n${result.sequence.join(', ')}, ?`,
    displaySequence: result.sequence,
    answer: String(result.answer),
    hints: result.hints,
    explanation: result.rule,
    difficulty: ruleIndex >= 3 ? 'hard' : ruleIndex >= 1 ? 'medium' : 'easy',
  };
}
