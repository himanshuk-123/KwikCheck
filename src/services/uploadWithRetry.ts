/**
 * Robust upload helper with exponential backoff retry logic
 * - Retries ONLY on network / timeout / 5xx errors
 * - Does NOT retry on validation / backend logic errors
 * - Compatible with backend that requires duplicate paramName fields
 */

import { HandleValuationUpload } from "./Slices/HandleValuationUpload";
import { HandleValuationUploadType } from "@src/@types/HandleValuationUploadType";

interface UploadWithRetryOptions {
  maxRetries?: number;
  initialDelayMs?: number;
  backoffMultiplier?: number;
}

const DEFAULT_OPTIONS: Required<UploadWithRetryOptions> = {
  maxRetries: 3,
  initialDelayMs: 1000,
  backoffMultiplier: 2,
};

const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const uploadImageWithRetry = async (
  uploadParams: HandleValuationUploadType,
  options: UploadWithRetryOptions = {}
) => {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  let lastError: any;
  let delayMs = opts.initialDelayMs;

  for (let attempt = 1; attempt <= opts.maxRetries; attempt++) {
    try {
      if (__DEV__) {
        console.log(
          `[uploadWithRetry] Attempt ${attempt}/${opts.maxRetries}`,
          {
            LeadId: uploadParams.LeadId,
            paramName: uploadParams.paramName,
          }
        );
      }

      const response = await HandleValuationUpload(uploadParams);

      if (__DEV__) {
        console.log(
          `[uploadWithRetry] ✅ Success on attempt ${attempt}`
        );
      }

      return {
        success: true,
        attempt,
        response,
      };
    } catch (error: any) {
      lastError = error;

      const retryable = isRetryableError(error);

      console.error(
        `[uploadWithRetry] ❌ Attempt ${attempt} failed`,
        {
          retryable,
          message: error?.message,
        }
      );

      // ❌ Do not retry non-retryable errors
      if (!retryable) {
        break;
      }

      // ❌ No delay after last attempt
      if (attempt === opts.maxRetries) {
        break;
      }

      if (__DEV__) {
        console.log(
          `[uploadWithRetry] Waiting ${delayMs}ms before retry...`
        );
      }

      await sleep(delayMs);
      delayMs *= opts.backoffMultiplier;
    }
  }

  return {
    success: false,
    attempt: opts.maxRetries,
    error: lastError,
  };
};

/**
 * Retry rules:
 * ✅ retry → network issues, timeouts, 5xx
 * ❌ no retry → validation errors, backend rejection, 4xx
 */
function isRetryableError(error: any): boolean {
  if (!error) return false;

  const message = (error.message || "").toLowerCase();

  // Network / transport errors
  if (
    message.includes("network") ||
    message.includes("timeout") ||
    message.includes("socket") ||
    message.includes("aborted") ||
    message.includes("econnrefused") ||
    message.includes("enotfound")
  ) {
    return true;
  }

  // HTTP status-based retry
  const status = error?.response?.status;

  // Retry ONLY 5xx
  if (status >= 500 && status < 600) {
    return true;
  }

  // ❌ 4xx = client / validation error
  return false;
}

export default uploadImageWithRetry;
