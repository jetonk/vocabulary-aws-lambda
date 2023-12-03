import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { vocabulary } from "./vocabulary";

export interface VocabularyData {
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

export interface WordCount {
  [key: string]: number;
}

export const countWords = (
  text: string,
  vocabulary: VocabularyData
): WordCount => {
  const words = text.toLowerCase().split(/\s+/);
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

const headers = {
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Origin": "*",
  "Content-Type": "application/json",
  "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PATCH",
};

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const vocabularyData: VocabularyData = vocabulary;
  const searchWords = event.queryStringParameters || {};
  const query: string = searchWords.search as string;

  try {
    const count = countWords(query, vocabularyData);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(count, null, 2),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify(error, null, 2),
    };
  }
};
