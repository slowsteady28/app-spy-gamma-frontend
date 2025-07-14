import React from "react";

const CustomerName: React.FC = function () {
  const email = localStorage.getItem("email");
  const username = email ? email.split("@")[0] : "No username";
  return username;
};

export default CustomerName;
