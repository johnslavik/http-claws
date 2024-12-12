import { Md5 } from 'ts-md5';
import { StatusCodes } from 'http-status-codes';

export function popFrom<T>(arr: T[], idx: number): T {
  return arr.splice(idx)[0];
}

export function randInt(max: number, min: number = 0): number {
  return min + Math.floor(Math.random() * max);
}

export function choice<T>(arr: T[]): T {
  return arr[randInt(arr.length)];
}

const IMAGE_URI_TEMPLATE = 'cats/{}.jpg';
const EXCLUDED_CODES = ['419', '420', '505'];
const UPPERCASE_WORDS = ['URI', 'HTTP', 'OK'];

const HTTP_CODES: string[] = Object.keys(StatusCodes).filter(
  (key) => key.length === 3
);

EXCLUDED_CODES.forEach((code) => {
  const idx = HTTP_CODES.indexOf(code);
  if (idx !== -1) HTTP_CODES.splice(idx, 1);
});

export const HASHCAT: Record<string, string> = Object.fromEntries(
  HTTP_CODES.map((code) => [Md5.hashAsciiStr(code), code])
);

/** Returns a random valid HTTP code (as a number). */
export function randomHttpCode(): number {
  return Number(choice(HTTP_CODES));
}

/**
 * Builds an image path for the given HTTP code.
 * @param httpCode - HTTP status code.
 * @param useMd5 - Whether to hash the code to pick the image (default: true).
 */
export function imageForHttpCode(httpCode: number, useMd5: boolean = true): string {
  const httpCodeString = httpCode.toString();
  return IMAGE_URI_TEMPLATE.replace(
    '{}',
    useMd5 ? Md5.hashAsciiStr(httpCodeString).toString() : httpCodeString
  );
}

/**
 * Normalizes a word from STATUS_CODE format into display form,
 * while preserving uppercase constants like HTTP/OK/URI.
 */
function mapPhraseWord(word: string): string {
  return UPPERCASE_WORDS.includes(word)
    ? word
    : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

/**
 * Converts a numeric HTTP code into a readable phrase.
 * (e.g. 404 → "Not Found")
 */
export function phraseForHttpCode(httpCode: number): string {
  const codeName = (StatusCodes as Record<number, string>)[httpCode];
  return codeName
    ? codeName.split('_').map(mapPhraseWord).join(' ')
    : `Unknown Code ${httpCode}`;
}
