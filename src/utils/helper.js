import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import { cardApi } from "./services/cartSevices";
import ImagePath from "@/constants/imagepath";
import API from "./services/Endpoints";
import { Done, HourglassTop } from "@mui/icons-material";

export const showToast = (type, message) => {
  switch (type) {
    case "success":
      toast.success(message, {
        autoClose: 3000,
        toastId: message,
      });
      break;
    case "error":
      toast.error(message, {
        autoClose: 3000,
        toastId: message,
      });
      break;
    case "info":
      toast.info(message, {
        autoClose: 3000,
        toastId: message,
      });
      break;
    case "warning":
      toast.warn(message, {
        autoClose: 3000,
        toastId: message,
      });
      break;
    default:
      toast(message, {
        autoClose: 3000,
        toastId: message,
      });
      break;
  }
};

export const getSessionId = () => {
  let sessionId = localStorage.getItem("session_id");
  if (!sessionId) {
    sessionId = uuidv4();
    localStorage.setItem("session_id", sessionId);
  }
  return sessionId;
};

export const getPaymentUrlById = async (paymentId) => {
  switch (paymentId) {
    case 1:
      return "";
    case 7:
      return API.NGENIUS;
    case 5:
      return API.TABBY;
    case 9:
      return API.TAMARA;
    default:
      return null;
  }
};

export const mergeCartCall = async (id, userId) => {
  const params = {
    cart_id: id,
    customer_id: userId,
  };
  try {
    await cardApi.mergeCart(params);
  } catch (error) {
    console.log(error);
  }
};

export const PaymentGateway = (gatewayName) => {
  let description = "";
  let iconName;
  switch (gatewayName) {
    case "COD":
      description = "Cash On Delivery";
      iconName = ImagePath.cod;
      break;
    case "Card":
      description = "Pay via Visa and MasterCard";
      iconName = ImagePath.cardLogo;
      break;
    case "Transfer":
      description = "Bank Transfer";
      iconName = ImagePath.apple;
      break;
    case "Store Visa":
      description = "Visa in-store payment";
      iconName = ImagePath.visa;
      break;
    case "Tabby":
      description = "Buy Now, Pay Later";
      iconName = ImagePath.tabby;
      break;
    case "Postpay":
      description = "Postpay option";
      iconName = ImagePath.postpay;
      break;
    case "Network Card":
      description = "Network Credit Card";
      iconName = ImagePath.card;
      break;
    case "Delivery Visa":
      description = "Visa for Delivery";
      iconName = ImagePath.visa;
      break;
    case "Tamara":
      description = "Installment Payment";
      iconName = ImagePath.tamara;
      break;
    case "Pay By Link - Network":
      description = "Network Payment Link";
      iconName = ImagePath.card;
      break;
    case "Pay By Link - Tabby":
      description = "Tabby Payment Link";
      iconName = ImagePath.card;
      break;
    case "Pay By Link - Tamara":
      description = "Tamara Payment Link";
      iconName = ImagePath.card;
      break;
    case "Apple Pay":
      description = "Apple Pay Wallet";
      iconName = ImagePath.applePay;
      break;
    case "Cash":
      description = "Cash Payment";
      iconName = ImagePath.cod;
      break;
    case "Samsung Pay":
      description = "Samsung Wallet";
      iconName = ImagePath.card;
      break;
    case "Paymob":
      description = "Paymob Gateway";
      iconName = ImagePath.card;
      break;
    case "Edfapay":
      description = "Edfapay Gateway";
      iconName = ImagePath.edfa;
      break;
    case "Pay By link - Paymob":
      description = "Paymob Payment Link";
      iconName = ImagePath.card;
      break;
    case "TapPay":
      description = "TapPay Gateway";
      iconName = ImagePath.tappay;
      break;
    default:
      description = "Payment Gateway Not Found";
      iconName = ImagePath.card;
      break;
  }
  return {
    icon: iconName,
    desc: description,
  };
};

export const google_place_api = "AIzaSyAwcOSQ6hnqoqiXX_1D1ykHOBAZZ2UorHE";

export const returnOrderStatus = (status) => {
  const statusMap = {
    Pending: {
      bgColor: "#1a5f20",
      icon: <Done sx={{ color: "#fff" }} />,
    },
    "Ready To Ship": {
      bgColor: "#1a5f20",
      icon: <Done sx={{ color: "#fff" }} />,
    },
    "Store Pickup": {
      bgColor: "#1a5f20",
      icon: <Done sx={{ color: "#fff" }} />,
    },
    Delivered: {
      bgColor: "#1a5f20",
      icon: <Done sx={{ color: "#fff" }} />,
    },
    "On The Way": {
      bgColor: "#1a5f20",
      icon: <Done sx={{ color: "#fff" }} />,
    },
    Completed: {
      bgColor: "#1a5f20",
      icon: <Done sx={{ color: "#fff" }} />,
    },
  };

  return (
    statusMap[status] || {
      bgColor: "#ccc",
      icon: <HourglassTop sx={{ color: "#000" }} />,
    }
  );
};
