type ApiErrorPayload = {
  details?: string;
  error?: string;
  message?: string;
  title?: string;
};

type ApiErrorLike = {
  response?: { data?: ApiErrorPayload };
  message?: string;
};

export const getApiErrorMessage = (error: unknown, fallback: string) => {
  const candidate = error as ApiErrorLike;
  return candidate.response?.data?.details
    ?? candidate.response?.data?.error
    ?? candidate.response?.data?.message
    ?? candidate.response?.data?.title
    ?? candidate.message
    ?? fallback;
};
