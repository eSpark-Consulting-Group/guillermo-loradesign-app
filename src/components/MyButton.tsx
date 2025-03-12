import React from "react";
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from "react-native";

interface MyButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  style?: ViewStyle;
}

const MyButton: React.FC<MyButtonProps> = ({ children, onClick, style }) => {
  return (
    <TouchableOpacity onPress={onClick} style={[styles.button, style]}>
      <Text style={styles.text}>{children}</Text>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  button: {
    padding: 10,
    // backgroundColor: "#007BFF",
    borderRadius: 4,
    alignItems: "center",
    borderWidth: 1,
  },
  text: {},
});

export default MyButton;
