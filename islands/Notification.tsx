// /islands/Notification.tsx
import { useEffect, useState } from "preact/hooks";

interface NotificationProps {
  message: string;
  onClose: () => void;
}

const Notification = ({ message, onClose }: NotificationProps) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div class="fixed bottom-0 left-0 right-0 flex justify-center items-center z-50">
      <div class="bg-red-500 text-white px-4 py-2 rounded shadow-md flex items-center">
        <span>{message}</span>
        <button
          onClick={() => {
            setVisible(false);
            onClose();
          }}
          class="ml-4 bg-transparent border-0 text-white cursor-pointer"
        >
          &times;
        </button>
      </div>
    </div>
  );
};

export default Notification;
