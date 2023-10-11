import {
    createContext,
    useContext,
    useState,
} from "react";

const StatusBarContext = createContext(null);

const StatusBarProvider = ({ children }) => {
    const [state, setState] = useState({ index: -1, total: 1});
	const setBar = (index, total) =>{
		//console.log({index, total})
		setState({index, total})
	}
    return (
        <StatusBarContext.Provider value={{ ...state, setBar }}>
            {children}
        </StatusBarContext.Provider>
    );
};
const useStatusBar = () => {
    return useContext(StatusBarContext);
};
export { StatusBarProvider, useStatusBar };
