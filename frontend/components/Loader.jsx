import { ActivityIndicator } from "react-native";
import { useTheme } from "../context/ThemeContext";

const Loader = ({ visible = true }) => {
    const theme = useTheme();
    return visible? <ActivityIndicator
				style={{
					position: "absolute",
					backgroundColor:
						"rgba(0,0,0,0.3)",
					left: 0,
					right: 0,
					bottom: 0,
					top: 0,
				}}
				color={theme.primary}
				size="large"
			/> : null
};

export default Loader;
