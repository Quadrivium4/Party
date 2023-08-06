import { ActivityIndicator, Modal } from "react-native";
import { useTheme } from "../context/ThemeContext";
import { useEffect } from "react";

const Pop = ({ visible, toggle, children, close }) => {
    const theme = useTheme();
    return (
        <>
            <TouchableWithoutFeedback onPress={toggle}>
                <View
                    style={{
                        backgroundColor: "transparent",
                        height: "100%",
                        width: "100%",
                        position: "absolute",
                    }}
                ></View>
            </TouchableWithoutFeedback>
            <Modal
                visible={visible}
                style={{
                    position: "absolute",
                    backgroundColor: "rgba(0,0,0,0.3)",
                    left: 0,
                    right: 0,
                    bottom: 0,
                    top: 0,
                }}
                color={theme.primary}
                size="large"
            >
                {children}
            </Modal>
        </>
    );
};

export default Pop;
