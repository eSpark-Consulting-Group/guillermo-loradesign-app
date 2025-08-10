import Toast from "react-native-toast-message";

export const showToast = (
  message: string,
  type?: "success" | "error" | "info",
  msg2?: string
) => {
  Toast.show({
    type: type,
    position: "top",
    text1: message,
    topOffset: 0,
    text2: msg2,
  });
};
