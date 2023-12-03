import { countWords, VocabularyData } from "../index"; // Replace with the actual file name
import { vocabulary } from "../vocabulary";

describe("countWords", () => {
  const vocabularyData: VocabularyData = vocabulary;

  test("should count words correctly", () => {
    const text = "The cat is running quickly";
    const result = countWords(text, vocabularyData);
    expect(result).toEqual({
      determiner: 1,
      noun: 1,
      adverb: 1,
    });
  });

  test("should handle empty text", () => {
    const text = "";
    const result = countWords(text, vocabularyData);
    expect(result).toEqual({});
  });

  test("should handle unknown words", () => {
    const text = "cows do mourn";
    const result = countWords(text, vocabularyData);
    expect(result).toEqual({});
  });
});
