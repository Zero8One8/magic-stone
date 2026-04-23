import md5 from "md5";

const MERCHANT_ID = "72550";
const SECRET_WORD1 = "ccc4451d21b18ff34d5aa48637ce88cb";

/**
 * Generates a Freekassa payment URL for a given product.
 *
 * @param amount  - Price in rubles (integer, e.g. 2500)
 * @param orderId - Unique order identifier
 * @param currency - Payment currency (default: RUB)
 */
export function buildFreekassaUrl(
  amount: number,
  orderId: string,
  currency = "RUB"
): string {
  const amountStr = amount.toFixed(2); // "2500.00"
  const sign = md5(`${MERCHANT_ID}:${amountStr}:${SECRET_WORD1}:${orderId}`);

  const params = new URLSearchParams({
    m: MERCHANT_ID,
    oa: amountStr,
    o: orderId,
    s: sign,
    currency,
    lang: "ru",
  });

  return `https://pay.freekassa.net/?${params.toString()}`;
}

/**
 * Creates a unique order ID from a product slug and timestamp.
 */
export function makeOrderId(slug: string): string {
  return `${slug}-${Date.now()}`;
}
