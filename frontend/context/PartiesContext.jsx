import { createContext, useContext, useEffect, useReducer } from "react";
import { crossing, protectedCrossing } from "../utils";
import { baseUrl, protectedUrl } from "../constants";
import * as SecureStore from "expo-secure-store";
import { signInWithGoogle } from "../controllers/auth";

const PartiesContext = createContext(null);
const PartiesDispatchContext = createContext(null);
const partiesState = {
    parties: [],
    myParties: []
};
const PartiesReducer = (state, action) => {
    //console.log("dispatching...", action)
    switch (action.type) {
        case "ADD_PARTY":
            return { ...state, loading: action.value };
        default:
            console.log("ERROR: unknown action type: ", action.type);
            break;
    }
};
const PartiesProvider = ({ children }) => {
    const [state, dispatch] = useReducer(PartiesReducer, partiesState);
    

    return (
        <PartiesContext.Provider
            value={{...state}}
        >
            <PartiesDispatchContext.Provider value={dispatch}>
                {children}
            </PartiesDispatchContext.Provider>
        </PartiesContext.Provider>
    );
};
const useParties = () => {
    return useContext(PartiesContext);
};
const usePartiesDispatch = () => {
    return useContext(PartiesDispatchContext);
};
export { PartiesProvider, useParties, usePartiesDispatch };
