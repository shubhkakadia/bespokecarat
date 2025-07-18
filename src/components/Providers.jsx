"use client";

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "../state/store";
import { AuthProvider } from "../contexts/AuthContext";

export default function Providers({ children }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AuthProvider>{children}</AuthProvider>
      </PersistGate>
    </Provider>
  );
}
