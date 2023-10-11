import { createContext, useContext, useState } from "react";

const TouchContext = createContext(null);

const TouchProvider = ({ children }) => {
    const [state, setState] = useState();
	const handleTouch = (e) =>{
		setState(e);
	}
    return (
        <TouchContext.Provider value={{ onTouch: state, handleTouch }}>
            {children}
        </TouchContext.Provider>
    );
};
const useTouch = () => {
    return useContext(TouchContext);
};
export { TouchProvider, useTouch };
