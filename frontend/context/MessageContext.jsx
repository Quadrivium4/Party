import {
    createContext,
    useContext,
    useEffect,
    useReducer,
    useState,
} from "react";
import { crossing, protectedCrossing } from "../utils";
import * as SecureStore from "expo-secure-store";

const MessageContext = createContext(null);

const MessageProvider = ({ children }) => {
    const [state, setState] = useState({content: null, type: null});
    const message = {
        error: (message) => {
            console.log("new error message dispatched", message)
            setState({ content: message, type: "error" });
        },
        success: (message) => {
            setState({ content: message, type: "success" });
        },
        warning: (message) => {
            setState({ content: message, type: "warning" });
        },
    };
    return (
        <MessageContext.Provider value={{ ...state, message }}>
            {children}
        </MessageContext.Provider>
    );
};
const useMessage = () => {
    return useContext(MessageContext);
};
export { MessageProvider, useMessage };
