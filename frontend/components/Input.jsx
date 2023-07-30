import { StyleSheet,View, Pressable, TextInput, Keyboard, Platform, ScrollView, InputAccessoryView} from 'react-native';
import {NavigationContainer, Link, useNavigation} from "@react-navigation/native";
import {useState, useEffect} from "react";
import { useAuth, useAuthDispatch } from '../context/AuthContext';
import {GeoapifyGeocoderAutocomplete, GeoapifyContext} from  "@geoapify/react-geocoder-autocomplete"
import { crossing } from '../utils';
import Select from './Select';
import TextOut  from "./Text"
import { useTheme } from '../context/ThemeContext';
import DateTimePicker from "@react-native-community/datetimepicker";
import * as Crypto from "expo-crypto";
import Button from './Button';
const Input = (props) => <>{props.children}</>;


const useInput = () =>{
    const theme = useTheme();
    console.log({theme})
    const initialStyles = {
        backgroundColor: theme.medium,
        alignItems: "center",
        justifyContent: "center",
        padding: 5,
        color: theme.foreground,
        borderColor: "transparent",
        borderWidth: 1,
    };
    const [styles, setStyles] = useState(initialStyles);
    useEffect(()=>{
        setStyles(initialStyles)
    },[theme])
    
    const onFocus = () => setStyles({...styles, borderColor: styles.color});
    const onFocusOut = () => setStyles(initialStyles);
    
    return {
        styles,
        onFocus,
        onFocusOut
    }
}
const DefaultInput = (props)=>{
        const [text, setText] = useState(props.value || props.defaultValue|| "");
        const theme = useTheme();
        const uniqueId = Crypto.randomUUID()
        useEffect(()=>{
            setText(props.value);
        }, [props.value])
        const {styles , onFocus, onFocusOut} = useInput();
        //console.log({styles})
        const newProps =  {
            ...props,
            onFocus, 
            onBlur: onFocusOut, 
            style: styles, 
            value: text, 
            inputAccessoryViewID: uniqueId,
            autoCorrect: false,
            spellCheck: false,
            keyboardAppearance: theme.isDark? "dark" : "light",
            onChangeText: (e)=>{
                setText(e);
                props.onChangeText(e)
            }
        } 
        return (
            <>
                <TextInput {...newProps}></TextInput>
                <InputAccessoryView nativeID={uniqueId}>
                    <Button onPress={Keyboard.dismiss}>done</Button>
                </InputAccessoryView>
            </>
        );

}

const Number = ({defaultValue, value, ...props}) =>{
    const handleChange = (e) =>props.onChangeText(parseInt(e));
    return <DefaultInput {...props} keyboardType='numeric' defaultValue={defaultValue?.toString()} value={(value?.toString())} onChangeText={handleChange}></DefaultInput>
}
const Textarea = (props) =>{
    return <DefaultInput multiline={true} numberOfLines={10}  {...props} style={{height: Platform.OS === "ios"? 150 : null, textAlignVertical: 'top', ...props.style}}></DefaultInput>
}
const Date = ({ onChangeText, ...props }) => {
    const theme = useTheme();
    const [display,setDisplay] = useState(false);
    return Platform.OS === "ios" || display?  <DateTimePicker {...props} accentColor={theme.primary_contrast} onChange={(event, date)=>{
        console.log(event.nativeEvent.timestamp)
        //if(event.type === "dismissed"){
            setDisplay(false);
        
        console.log(date)
        onChangeText({date, timestamp: event.nativeEvent.timestamp})
    }}></DateTimePicker> : <Button onPress={()=>setDisplay(true)}>select date</Button>;
};
const Maps = ({onChangeText, ...props}) =>{
    const theme = useTheme();
    const [places, setPlaces] = useState([])
    const [text, setText] = useState( props.value || props.defaultValue || "");
    const autocomplete = async (t) =>{
        let result = await crossing(`https://api.geoapify.com/v1/geocode/autocomplete?text=${t}&apiKey=3d65b7c6286c4cf5a7c0083a295de089`)
        //console.log(result)
        if(result?.features?.length > 0){
                //console.log("results number: ", result.features.length);
                let results = [];
                result.features.forEach(place =>{
                    const res = {
                        name: `${place.properties.address_line1}, ${place.properties.address_line2}`,
                        coords: {x: place.geometry.coordinates[0],y: place.geometry.coordinates[1] },
                        country: place.properties.country,
                        county: place.properties.county
                    }
                    results.push(res);
                })
                setPlaces(results);
        }
    }
    const handleSetLocation = (place) =>{
        console.log(place.name);
        setText(place.name)
        onChangeText(place);
        setPlaces([])
        
    }
    return (
        <View>
        
        <DefaultInput {...props} onChangeText={autocomplete} value={text}></DefaultInput>
            <ScrollView keyboardShouldPersistTaps="handled"
            style={{backgroundColor: theme.primary, padding: places.length > 0? 10: 0, borderTopColor: "black", borderTopWidth: places.length > 0? 1: 0}}>
                {
                    
                    places?
                    places?.map(place =>{
                        return (
                            <Pressable key={Math.random()} onPress={()=>handleSetLocation(place)} style={{marginBottom: 5}}>
                                <TextOut.P style={{color: theme.foreground}}>{place.name}</TextOut.P>
                            </Pressable>)
                        
                    }): null
                }
                </ScrollView>
        </View>
        
            
    )
}

Input.Textarea = ({onChangeText})=> Textarea({onChangeText});
Input.Text = DefaultInput;
Input.Maps = Maps;
Input.Number = Number;
Input.Date = Date;
export default Input