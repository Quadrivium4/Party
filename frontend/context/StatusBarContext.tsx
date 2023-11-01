import {
    createContext,
    useContext,
    useState,
    ReactNode
} from "react";
type TStatusBarContextProps = {
    index: number,
    total: number,
    setBar: (index: number, total: number) => void
} |null;
const StatusBarContext = createContext<TStatusBarContextProps>(null);

const StatusBarProvider = ({ children }: {children: ReactNode}) => {
    const [state, setState] = useState({ index: -1, total: 1});
	const setBar = (index: number, total: number) =>{
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
    let statusBarContext = useContext(StatusBarContext);
    if(!statusBarContext) throw new Error("useStatusBar must be used inside status bar context")
    return statusBarContext
};
export { StatusBarProvider, useStatusBar };
