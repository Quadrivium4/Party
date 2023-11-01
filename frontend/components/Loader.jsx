import { ActivityIndicator, Modal } from "react-native";
import { useTheme } from "../context/ThemeContext";

const Loader = ({ visible = true, fullscreen= false}) => {
    const theme = useTheme();
	const basicLoader = (
        <ActivityIndicator
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
        />
    );
	if(fullscreen && visible) return <Modal transparent={true}>{basicLoader}</Modal>

    return( visible? basicLoader : null)
};

export default Loader;
