const PATTERN_TEMPLATES = [
  {
    name: 'Symbol Cycle',
    generate: (random) => {
      const symbols = ['◆', '●', '▲', '■', '★'];
      const cycleLen = Math.floor(random() * 2) + 2;
      const chosen = [];
      for (let i = 0; i < cycleLen; i++) {
        chosen.push(symbols[Math.floor(random() * symbols.length)]);
      }
      const display = [];
      for (let i = 0; i < 8; i++) {
        display.push(chosen[i % cycleLen]);
      }
      const answer = chosen[8 % cycleLen];

      return {
        pattern: display,
        answer,
        hints: [
          `The pattern repeats every ${cycleLen} symbols`,
          `The cycle is: ${chosen.join(' ')}`,
          `The next symbol is ${answer}`,
        ],
        explanation: `The pattern cycles: ${chosen.join(' ')} (repeats every ${cycleLen})`,
      };
    },
  },
  {
    name: 'Letter Pattern',
    generate: (random) => {
      const startCode = Math.floor(random() * 20) + 65;
      const step = Math.floor(random() * 3) + 1;
      const letters = [];
      for (let i = 0; i < 6; i++) {
        letters.push(String.fromCharCode(((startCode - 65 + step * i) % 26) + 65));
      }
      const answer = String.fromCharCode(((startCode - 65 + step * 6) % 26) + 65);

      return {
        pattern: letters,
        answer,
        hints: [
          'Look at the position of each letter in the alphabet',
          `Each letter moves forward by ${step}`,
          `The next letter is ${answer}`,
        ],
        explanation: `Letters advance by ${step} positions in the alphabet`,
      };
    },
  },
  {
    name: 'Number Pattern',
    generate: (random) => {
      const base = Math.floor(random() * 5) + 1;
      const ops = ['+', '*'];
      const op = ops[Math.floor(random() * ops.length)];
      const val = Math.floor(random() * 4) + 2;
      const seq = [base];

      for (let i = 1; i < 6; i++) {
        if (op === '+') {
          seq.push(seq[i - 1] + val * i);
        } else {
          seq.push(seq[i - 1] * val);
        }
      }

      const answer = op === '+' ? seq[5] + val * 6 : seq[5] * val;

      return {
        pattern: seq,
        answer: String(answer),
        hints: [
          `The operation involves ${op === '+' ? 'addition' : 'multiplication'}`,
          op === '+'
            ? `The difference increases by ${val} each time`
            : `Each term is multiplied by ${val}`,
          `The next number is ${answer}`,
        ],
        explanation:
          op === '+'
            ? `Add increasing multiples of ${val}`
            : `Multiply each term by ${val}`,
      };
    },
  },
];

export function generatePatternPuzzle(random) {
  const templateIndex = Math.floor(random() * PATTERN_TEMPLATES.length);
  const template = PATTERN_TEMPLATES[templateIndex];
  const result = template.generate(random);

  return {
    question: `Find the next element in the pattern:\n${result.pattern.join('  ')}  ?`,
    displayPattern: result.pattern,
    answer: String(result.answer),
    hints: result.hints,
    explanation: result.explanation,
    difficulty: templateIndex >= 2 ? 'hard' : 'medium',
  };
}
