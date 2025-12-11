import AppErrorMessage from "@src/services/Slices/AppErrorMessage";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

const FallbackComponent = ({ onRetry }) => (
  <View
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100%",
      width: "100%",
    }}
  >
    <Text style={{ fontSize: 20 }}>oops! Something went wrong.</Text>
    <TouchableOpacity onPress={onRetry}>
      <Text style={{ fontSize: 14, paddingTop: 12 }}>Click here to retry</Text>
    </TouchableOpacity>
  </View>
);

class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  async logErrorToServer(error, info) {
    try {
      const stack = info.componentStack;
      console.log("In logErrorToServer", typeof info, stack);
      await AppErrorMessage({ message: error + stack.toString() });
    } catch (error) {
      console.log("Error", error);
    }
  }
  componentDidCatch(error, info) {
    // logErrorToService(error, info.componentStack);
    console.log("ERROR IN FOLLOWING", info);
    this.logErrorToServer(error, info);
  }
  handleRetry = () => {
    this.setState({ hasError: false });
  };
  render() {
    return this.state.hasError ? (
      <FallbackComponent onRetry={this.handleRetry} />
    ) : (
      this.props.children
    );
  }
}

export default ErrorBoundary;
