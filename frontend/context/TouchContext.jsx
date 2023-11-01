import { createContext, useContext, useEffect, useState } from "react";
import {Keyboard} from "react-native"
const TouchContext = createContext(null);

const TouchProvider = ({ children }) => {
    let subscribers = [];
	const handleTouch = (e) =>{
        //console.log("touch handled");
        subscribers.forEach(f => {
            f(e)
        });
	}
    const subscribe = (f) =>{
        //console.log("new subscriber", f)
        if (subscribers.indexOf(f) > -1) return;
        subscribers.push(f);
    }
    const unsubscribe = (f) => {
        //console.log("unsubscribing...")
        subscribers = subscribers.filter(subscriber => subscriber !== f);
    };
    const logSubscribers = () =>{
        console.log({subscribers})
    }
    const Touch = {
        subscribe,
        unsubscribe
    }
    return (
        <TouchContext.Provider value={{ Touch, handleTouch, logSubscribers }}>
            {children}
        </TouchContext.Provider>
    );
};

const useTouch = () => {
    return useContext(TouchContext);
};
const useKeyboardDismiss = () =>{
        const {Touch} = useTouch();
        useEffect(()=>{
            Touch.subscribe(Keyboard.dismiss)
            return () => Touch.unsubscribe(Keyboard.dismiss)
        },[])
}
export { TouchProvider, useTouch, useKeyboardDismiss };
