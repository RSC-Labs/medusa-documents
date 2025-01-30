import { defaultCurrencies } from "@medusajs/utils";

const DEFAULT_DECIMAL_DIGITS = 2;

export function getDecimalDigits(currencyCode: string): number {
  try {
    const decimalDigits = defaultCurrencies[currencyCode.toUpperCase()] !== undefined ? defaultCurrencies[currencyCode.toUpperCase()].decimal_digits : undefined;
    if (decimalDigits !== undefined) {
      return decimalDigits;
    }
  } catch {
    return DEFAULT_DECIMAL_DIGITS;
  }
  return DEFAULT_DECIMAL_DIGITS;
}