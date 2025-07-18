import React from "react";

const CustomerName: React.FC = () => {
  const email = localStorage.getItem("email");
  const username = email ? email.split("@")[0] : "No username";

  return <span>{username}</span>; // ✅ now it returns JSX
};

export default CustomerName;
