"use client";

import PrivateRoute from "@/components/PrivateRoute/PrivateRoute";

const ProtectedLayout = ({ children }) => {
  return <PrivateRoute>{children}</PrivateRoute>;
};

export default ProtectedLayout;
