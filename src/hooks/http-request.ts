import { useCallback, useState } from 'react';

export const useHttpRequest = <T>(request: Request) => {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<T>();
  const [error, setError] = useState<unknown>();

  const handleError = (r: unknown) => {
    setIsLoading(false);
    setError(r);
  };
  const run = useCallback(() => {
    setIsLoading(true);
    fetch(request)
      .then((res) => {
        res
          .json()
          .then((responseData) => {
            setIsLoading(false);
            setResponse(responseData as T);
          })
          .catch(handleError);
      })
      .catch(handleError);
  }, [request]);
  return [run, isLoading, response, error] as const;
};
