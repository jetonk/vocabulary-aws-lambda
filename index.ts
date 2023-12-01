import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import * as fs from "fs/promises";

interface VocabularyData {
  noun: string[];
  verb: string[];
  adjective: string[];
  adverb: string[];
  preposition: string[];
  conjunction: string[];
  pronoun: string[];
  interjection: string[];
  determiner: string[];
  numeral: string[];
}

interface WordCount {
  [key: string]: number;
}

const readVocabularyFile = async (): Promise<VocabularyData> => {
  const data: string = await fs.readFile("vocabulary.json", "utf8");
  return JSON.parse(data) as VocabularyData;
};

const countWords = (text: string, vocabulary: VocabularyData): WordCount => {
  const words = text.split(/\s+/);
  const wordCount: WordCount = {};

  words.forEach((word) => {
    for (const type in vocabulary) {
      if (vocabulary[type].includes(word)) {
        wordCount[type] = (wordCount[type] || 0) + 1;
        break;
      }
    }
  });

  return wordCount;
};

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const vocabulary: VocabularyData = await readVocabularyFile();
  const searchWords = event.queryStringParameters || {};
  const query: string = searchWords.search as string;

  try {
    const count = countWords(query, vocabulary);
    return {
      statusCode: 200,
      body: JSON.stringify(count, null, 2),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify(
        {
          error: `'Error reading or parsing the file:', ${error}`,
        },
        null,
        2
      ),
    };
  }
};
