import type { SupportedLanguage } from "../src/db/schema";
import { SUPPORTED_LANGUAGES } from "../src/db/schema";

export const SUPPORTED_LANGUAGE_CODES = SUPPORTED_LANGUAGES;
export type LanguageCode = SupportedLanguage;

export function isLanguageCode(value: unknown): value is LanguageCode {
  return typeof value === "string" && (SUPPORTED_LANGUAGE_CODES as readonly string[]).includes(value);
}
