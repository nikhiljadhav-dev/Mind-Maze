const SYLLOGISM_TEMPLATES = [
  {
    generate: (random) => {
      const categories = [
        ['cats', 'animals', 'living things'],
        ['roses', 'flowers', 'plants'],
        ['doctors', 'professionals', 'humans'],
        ['gold', 'metals', 'elements'],
        ['jazz', 'music', 'art forms'],
      ];
      const idx = Math.floor(random() * categories.length);
      const [specific, middle, broad] = categories[idx];

      const correct = random() > 0.5;

      if (correct) {
        return {
          premises: [`All ${specific} are ${middle}.`, `All ${middle} are ${broad}.`],
          conclusion: `Therefore, all ${specific} are ${broad}.`,
          answer: 'valid',
          hints: [
            'Check if the conclusion follows logically from both premises',
            `If A⊂B and B⊂C, does A⊂C hold?`,
            `This is a valid syllogism (transitive relation)`,
          ],
          explanation: `Valid: If all ${specific} are ${middle}, and all ${middle} are ${broad}, then all ${specific} must be ${broad}.`,
        };
      } else {
        return {
          premises: [`All ${specific} are ${middle}.`, `Some ${middle} are ${broad}.`],
          conclusion: `Therefore, all ${specific} are ${broad}.`,
          answer: 'invalid',
          hints: [
            'Pay attention to "all" vs "some" in the premises',
            `The second premise only says "some", not "all"`,
            `This syllogism is invalid — "some" doesn't guarantee "all"`,
          ],
          explanation: `Invalid: "Some ${middle} are ${broad}" doesn't mean all ${specific} are ${broad}.`,
        };
      }
    },
  },
  {
    generate: (random) => {
      const pairs = [
        ['students', 'hardworking', 'successful'],
        ['athletes', 'disciplined', 'winners'],
        ['scientists', 'curious', 'innovators'],
      ];
      const idx = Math.floor(random() * pairs.length);
      const [group, trait, outcome] = pairs[idx];

      const isValid = random() > 0.4;

      if (isValid) {
        return {
          premises: [`No ${group} are lazy.`, `All lazy people are ${outcome}.`],
          conclusion: `Therefore, no ${group} are ${outcome}.`,
          answer: 'invalid',
          hints: [
            'Just because no A are B, and all B are C, does that mean no A are C?',
            `${group} could still be ${outcome} through other means`,
            'This is invalid — the conclusion doesn\'t follow',
          ],
          explanation: `Invalid: ${group} not being lazy doesn't prevent them from being ${outcome}.`,
        };
      } else {
        return {
          premises: [`All ${group} are ${trait}.`, `No ${trait} person fails.`],
          conclusion: `Therefore, no ${group} fail.`,
          answer: 'valid',
          hints: [
            'Follow the chain: if A→B and B→not-C, what about A?',
            `All ${group} are ${trait}, and no ${trait} person fails`,
            'This is a valid deduction',
          ],
          explanation: `Valid: Since all ${group} are ${trait}, and no ${trait} person fails, no ${group} fail.`,
        };
      }
    },
  },
];

export function generateSyllogismPuzzle(random) {
  const templateIndex = Math.floor(random() * SYLLOGISM_TEMPLATES.length);
  const template = SYLLOGISM_TEMPLATES[templateIndex];
  const result = template.generate(random);

  return {
    question: `Determine if this syllogism is VALID or INVALID:\n\nPremise 1: ${result.premises[0]}\nPremise 2: ${result.premises[1]}\n\nConclusion: ${result.conclusion}`,
    premises: result.premises,
    conclusion: result.conclusion,
    answer: result.answer,
    options: ['valid', 'invalid'],
    hints: result.hints,
    explanation: result.explanation,
    difficulty: 'hard',
  };
}
