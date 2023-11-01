import { createContext, useContext, useEffect, useReducer, useState, ReactNode } from "react";
import { crossing, protectedCrossing } from "../utils";
import * as SecureStore from 'expo-secure-store';

const ThemeContext = createContext<TThemeContextProps>(null);
export type TThemeProps = {
    background: string,
    foreground: string,
    strong: string,
    medium: string,
    light: string,
    contrast: string,
    primary_contrast: string,
    transparent: {
        primary: string,
        light: string,
        medium: string,
        strong: string,
    }
    primary: string
    isDark: boolean,
    isLight: boolean,
}
type TThemeContextProps = TThemeProps & {
    toggleTheme: () => void
}| null;

const same = {
    primary: "rgb(255, 177, 0)",
}
const dark:TThemeProps =  {
    background: "rgb(15, 15,40)",
    foreground: "rgb(220, 220, 220)",
    strong: "rgb(10,10,25)",
    medium: "rgba(100,100,120, 0.5)",
    light: "rgba(120,120,120, 0.75)",
    contrast: "rgb(200,200,200)",
    primary_contrast: "rgb(255, 177, 0)",
    transparent: {
        primary: "rgba(255, 200, 100, 0.1)",
        light: "rgba(255, 255, 255, 0.1)",
        medium: "rgba(255, 255, 255, 0.5)",
        strong: "rgba(255, 255, 255, 0.75",
    },
    isDark: true,
    isLight: false,
    ...same
}
const light:TThemeProps = {
        background: "rgb(240,240,240)",
        foreground: "rgb(20,20,20)",
        strong: "white",
        medium: "rgb(200,200,200)",
        light: "rgb(120,120,120)",
        contrast: "rgb(120,120,120)",
        primary_contrast: "rgb(255, 177, 0)",
        transparent: {
            primary: "rgba(255, 177, 0, 0.25)",
            light: "rgba(0, 0, 0, 0.1)",
            medium: "rgba(0, 0, 0, 0.5)",
            strong: "rgba(0, 0, 0, 0.75",
        },
        isLight: true,
        isDark: false,
        ...same
    }


const ThemeProvider = ({children}: {children: ReactNode}) =>{
    const [state, setState] = useState<TThemeProps>({...dark, ...same});
    const toggleTheme = ()=>{
        //console.log({state })
        //console.log({state:  {...theme.dark, ...theme.same}})
        if(state?.isDark) setState({...light, ...same });
        else setState({...dark, ...same });
    }
    return (
        <ThemeContext.Provider value={{...state, toggleTheme}}>
            {children}
        </ThemeContext.Provider>
    )
}
const useTheme = () =>{
    let themeContext = useContext(ThemeContext);
    if(!themeContext) throw new Error("useTheme should be used inside theme context");
    return themeContext
}
export {
    ThemeProvider,
    useTheme
}