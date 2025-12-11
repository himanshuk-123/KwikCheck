import AppErrorMessage from "@src/services/Slices/AppErrorMessage";

export const handleWithErrorReporting = async <T>(
  fn: () => Promise<T>,
  onError?: Function,
): Promise<T> => {
  try {
    return await fn();
  } catch (error) {
    console.error("Caught an error:", error);

    try {
      await AppErrorMessage({
        message: `\n\n\n${error + error.stack.toString()}`,
      });
    } catch (apiError) {
      console.error("Failed to report error to API:", apiError);
    }

    if (onError) {
      onError(error);
    }

    throw error;
  }
};
