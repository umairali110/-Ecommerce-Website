"use client";

import { Provider } from "react-redux";
import { store } from "@/redux/store";
import AuthLoader from "@/app/components/AuthLoader";

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Provider store={store}>
      <AuthLoader />
      {children}
    </Provider>
  );
}