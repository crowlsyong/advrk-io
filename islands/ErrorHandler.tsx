// /islands/ErrorHandler.tsx
import { useEffect, useState } from "preact/hooks";
import Notification from "./Notification.tsx"; // Import the Notification component

interface ErrorHandlerProps {
  initialError?: string; // Make initialError optional
}

const ErrorHandler = ({ initialError }: ErrorHandlerProps) => {
  const [error, setError] = useState(initialError);

  useEffect(() => {
    if (initialError) {
      setError(initialError);
    }
  }, [initialError]);

  return error
    ? <Notification message={error} onClose={() => setError("")} />
    : null;
};

export default ErrorHandler;
