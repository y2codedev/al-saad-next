const tagStyles = [
  {
    type: "Success",
    color: "#28a745",
    backgroundColor: "rgba(40,167,69,0.18)",
  },
  {
    type: "Info",
    color: "#17a2b8",
    backgroundColor: "rgba(23,162,184,0.18)",
  },
  {
    type: "Warning",
    color: "#ffc107",
    backgroundColor: "rgba(255,193,7,0.18)",
  },
  {
    type: "Danger",
    color: "#dc3545",
    backgroundColor: "rgba(220,53,69,0.18)",
  },
  {
    type: "Primary",
    color: "#007bff",
    backgroundColor: "rgba(0,123,255,0.18)",
  },
  {
    type: "Secondary",
    color: "#495057",
    backgroundColor: "rgba(73,80,87,0.25)",
  },
  {
    type: "Purple",
    color: "#6f42c1",
    backgroundColor: "rgba(111,66,193,0.18)",
  },
  {
    type: "Dark",
    color: "#212529",
    backgroundColor: "rgba(33,37,41,0.25)",
  },
  {
    type: "Cyan",
    color: "#17a2b8",
    backgroundColor: "rgba(23,162,184,0.18)",
  },
  {
    type: "Orange",
    color: "#fd7e14",
    backgroundColor: "rgba(253,126,20,0.18)",
  },
  {
    type: "Teal",
    color: "#20c997",
    backgroundColor: "rgba(32,201,151,0.18)",
  },
  {
    type: "Pink",
    color: "#e83e8c",
    backgroundColor: "rgba(232,62,140,0.18)",
  },
  {
    type: "Cyan",
    color: "#17a2b8",
    backgroundColor: "rgba(23,162,184,0.18)",
  },
  {
    type: "Red",
    color: "#e74c3c",
    backgroundColor: "rgba(231,76,60,0.18)",
  },
  {
    type: "Yellow",
    color: "#f1c40f",
    backgroundColor: "rgba(241,196,15,0.18)",
  },
];

const getDeliveryType = (shippingType) => {
  if (shippingType == "sameday") {
    return tagStyles[0];
  } else if (shippingType == "premium") {
    return tagStyles[1];
  } else {
    return tagStyles[2];
  }
};

const getOrderStatusColor = (status) => {
  // Handle "Cancelled" status with a red color
  if (status === 6) {
    return tagStyles[13];
  }

  // Handle the specific status cases with different colors
  if (status === 1) {
    return tagStyles[2]; // Warning style for Pending (yellow)
  }
  if (status === 2) {
    return tagStyles[1]; // Info style for Ready To Ship (blue)
  }
  if (status === 3) {
    return tagStyles[8]; // Cyan style for Store Pickup
  }
  if (status === 7 || status === 4) {
    return tagStyles[0]; // Success style for Delivered (green)
  } else {
    return tagStyles[0]; // Default to Success style
  }
};

const getPaymentType = (paymentMethod) => {
  if (paymentMethod == "COD") {
    return tagStyles[0];
  } else if (paymentMethod == "Card") {
    return tagStyles[1];
  } else if (paymentMethod == "Transfer") {
    return tagStyles[2];
  } else if (paymentMethod == "Store Visa") {
    return tagStyles[3];
  } else if (paymentMethod == "Tabby") {
    return tagStyles[4];
  } else if (paymentMethod == "Postpay") {
    return tagStyles[5];
  } else if (paymentMethod == "Network Card") {
    return tagStyles[6];
  } else if (paymentMethod == "Delivery Visa") {
    return tagStyles[7];
  } else if (paymentMethod == "Tamara") {
    return tagStyles[8];
  } else if (paymentMethod == "Pay By Link - Network") {
    return tagStyles[9];
  } else if (paymentMethod == "Pay By Link - Tabby") {
    return tagStyles[10];
  } else if (paymentMethod == "Pay By Link - Tamara") {
    return tagStyles[11];
  } else if (paymentMethod == "Cash") {
    return tagStyles[12];
  } else if (paymentMethod == "Paymob") {
    return tagStyles[13];
  } else if (paymentMethod == "Apple Pay") {
    return tagStyles[14];
  } else {
    return tagStyles[0];
  }
};

export { tagStyles, getDeliveryType, getPaymentType, getOrderStatusColor };
