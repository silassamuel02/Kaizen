import {
  createContext,
  useContext,
  useState,
} from "react";

const NotificationContext =
  createContext();

export function NotificationProvider({

  children,

}) {

  const [notifications, setNotifications] =
    useState([]);

  function addNotification({

    title,
    message,

  }) {

    const id = Date.now();

    const notification = {
      id,
      title,
      message,
    };

    setNotifications((prev) => [
      notification,
      ...prev,
    ]);

    setTimeout(() => {

      setNotifications((prev) =>
        prev.filter((n) => n.id !== id)
      );

    }, 4000);
  }

  return (

    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
      }}
    >

      {children}

    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  return useContext(NotificationContext);
}