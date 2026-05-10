const SCENARIOS = [
  {
    title: 'Office Assignment',
    entities: ['Alice', 'Bob', 'Carol'],
    attributes: ['Marketing', 'Engineering', 'Design'],
    generate: (random) => {
      const shuffled = ['Marketing', 'Engineering', 'Design'].sort(() => random() - 0.5);
      const solution = { Alice: shuffled[0], Bob: shuffled[1], Carol: shuffled[2] };

      const clues = [];
      const names = ['Alice', 'Bob', 'Carol'];

      clues.push(`${names[0]} does not work in ${shuffled[1]}.`);
      clues.push(`${names[1]} is not in ${shuffled[2]} or ${shuffled[0] === 'Design' ? 'Marketing' : 'Design'}.`);
      clues.push(`The person in ${shuffled[2]} is not ${names[0]}.`);

      return { solution, clues, question: 'Match each person to their department.' };
    },
  },
  {
    title: 'Pet Owners',
    entities: ['Emma', 'Frank', 'Grace'],
    attributes: ['Dog', 'Cat', 'Bird'],
    generate: (random) => {
      const shuffled = ['Dog', 'Cat', 'Bird'].sort(() => random() - 0.5);
      const solution = { Emma: shuffled[0], Frank: shuffled[1], Grace: shuffled[2] };

      const clues = [
        `Emma does not have a ${shuffled[1]}.`,
        `Frank's pet is not a ${shuffled[2]}.`,
        `The ${shuffled[0]} owner is not Grace.`,
      ];

      return { solution, clues, question: 'Match each person to their pet.' };
    },
  },
  {
    title: 'Favorite Colors',
    entities: ['Dave', 'Eve', 'Ivy'],
    attributes: ['Red', 'Blue', 'Green'],
    generate: (random) => {
      const shuffled = ['Red', 'Blue', 'Green'].sort(() => random() - 0.5);
      const solution = { Dave: shuffled[0], Eve: shuffled[1], Ivy: shuffled[2] };

      const clues = [
        `Dave's favorite color is not ${shuffled[2]}.`,
        `Eve does not like ${shuffled[0]}.`,
        `Ivy's favorite is not ${shuffled[1]}.`,
      ];

      return { solution, clues, question: 'Match each person to their favorite color.' };
    },
  },
];

export function generateLogicGridPuzzle(random) {
  const scenarioIndex = Math.floor(random() * SCENARIOS.length);
  const scenario = SCENARIOS[scenarioIndex];
  const result = scenario.generate(random);

  const entities = scenario.entities;
  const attributes = scenario.attributes;
  const solutionArray = entities.map((e) => result.solution[e]);

  return {
    question: `${scenario.title}: ${result.question}\n\nClues:\n${result.clues.map((c, i) => `${i + 1}. ${c}`).join('\n')}`,
    gridEntities: entities,
    gridAttributes: attributes,
    clues: result.clues,
    title: scenario.title,
    answer: JSON.stringify(solutionArray),
    hints: [
      `Start by eliminating impossible matches from the clues`,
      `Focus on clue 1: ${result.clues[0]}`,
      `The solution is: ${entities.map((e) => `${e} → ${result.solution[e]}`).join(', ')}`,
    ],
    explanation: `Solution: ${entities.map((e) => `${e} → ${result.solution[e]}`).join(', ')}`,
    difficulty: 'medium',
  };
}
