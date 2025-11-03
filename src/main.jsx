import React from "react";
import ReactDOM from "react-dom/client";
import i18n from "./i18n";
import App from "./App";
import { Provider } from "react-redux";
import { store } from "./app/store";
import { I18nextProvider } from "react-i18next";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
        <I18nextProvider i18n={i18n}>
          <App />
        </I18nextProvider>

    </Provider>
  </React.StrictMode>
);

