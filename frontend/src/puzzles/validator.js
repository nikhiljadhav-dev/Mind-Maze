export function validateAnswer(puzzle, userAnswer) {
  if (!puzzle || userAnswer === null || userAnswer === undefined) {
    return { isCorrect: false, message: 'No answer provided' };
  }

  const expected = String(puzzle.answer).trim().toLowerCase();
  const given = String(userAnswer).trim().toLowerCase();

  if (puzzle.puzzleType === 'logicGrid') {
    try {
      const expectedArr = JSON.parse(expected);
      const givenArr = JSON.parse(given);

      if (!Array.isArray(expectedArr) || !Array.isArray(givenArr)) {
        return { isCorrect: false, message: 'Invalid answer format' };
      }

      const isCorrect =
        expectedArr.length === givenArr.length &&
        expectedArr.every((val, idx) => String(val).toLowerCase() === String(givenArr[idx]).toLowerCase());

      return {
        isCorrect,
        message: isCorrect ? 'Correct! Well done!' : 'Not quite right. Try again!',
        expected: expectedArr,
      };
    } catch {
      return { isCorrect: expected === given, message: expected === given ? 'Correct!' : 'Incorrect!' };
    }
  }

  const isCorrect = expected === given;

  return {
    isCorrect,
    message: isCorrect
      ? 'Correct! Well done!'
      : `Not quite right. The answer was ${puzzle.answer}.`,
    expected: puzzle.answer,
  };
}
