import { StyleSheet,View, Pressable, TextInput, Keyboard, Platform, ScrollView, InputAccessoryView, TouchableOpacity, TouchableWithoutFeedback, Dimensions, Modal} from 'react-native';
import {NavigationContainer, Link, useNavigation} from "@react-navigation/native";
import {useState, useEffect} from "react";
import { useAuth, useAuthDispatch } from '../context/AuthContext';
import {GeoapifyGeocoderAutocomplete, GeoapifyContext} from  "@geoapify/react-geocoder-autocomplete"
import { crossing, getDateFormatted } from '../utils';
import Select from './Select';
import TextOut  from "./Text"
import { useTheme } from '../context/ThemeContext';
import DateTimePicker from "@react-native-community/datetimepicker";
import * as Crypto from "expo-crypto";
import Button from './Button';
import Text from './Text';
import { useTouch } from '../context/TouchContext';
import { useMessage } from '../context/MessageContext';
const Input = (props) => <>{props.children}</>;


const useInput = () =>{
    const theme = useTheme();
    //console.log({theme})
    const borderBottomBaseColor = theme.transparent.light;
    const initialStyles = {
       // backgroundColor: theme.medium,
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 10,
        paddingHorizontal: 10,
        color: theme.foreground,
        borderBottomColor: borderBottomBaseColor,
        borderBottomWidth: 1,
        
    };
    const [styles, setStyles] = useState(initialStyles);
    useEffect(()=>{
        setStyles(initialStyles)
    },[theme])
    useEffect(()=>{
        //console.log("rerendered")
    },[])
    const onError = (toggle) => setStyles({ ...styles, borderBottomColor: toggle? "rgb(255, 100,100)" : borderBottomBaseColor });
    const onFocus = () => setStyles({...styles, borderBottomColor: styles.color});
    const onFocusOut = () => {
        //console.log("focus out")
        setStyles(initialStyles);
    }
    
    return {
        styles,
        onFocus,
        onFocusOut,
        onError
    }
}
const DefaultInput = ({error, ...props})=>{
        const [text, setText] = useState(props.value || props.defaultValue|| "");
        const theme = useTheme();
        const uniqueId = Crypto.randomUUID()
        useEffect(()=>{
            setText(props.value);
        }, [props.value])
        useEffect(()=>{
            onError(error)
        },[error])
        const {styles , onFocus, onFocusOut, onError} = useInput();
        //console.log({props})
        //console.log({styles})
        const onChangeText = (e) => {
            setText(e);
            props.onChangeText(e);
        };
        const newProps = {
            ...props,
            onFocus,
            onBlur: onFocusOut,
            style: styles,
            value: text,
            inputAccessoryViewID: uniqueId,
            autoCorrect: false,
            spellCheck: false,
            placeholderTextColor: theme.transparent.medium,
            keyboardAppearance: theme.isDark ? "dark" : "light",
            onChangeText
        }; 
        
        return (
            <>
                <TextInput {...newProps}></TextInput>
                {/*Platform.OS == "ios" ? (
                    <InputAccessoryView nativeID={uniqueId}>
                        <Pressable
                            onPress={() => {
                                Keyboard.dismiss();
                                props.onChangeText(text);
                            }}
                        >
                            <View
                                style={{
                                    borderTopLeftRadius: 10,
                                    borderTopRightRadius: 10,
                                    padding: 10,
                                    alignSelf: "flex-end",
                                    backgroundColor: "rgba(0,0,0,0.75)",
                                    borderColor: "gray",
                                    borderWidth: 1,
                                    borderBottomWidth: 0
                                }}
                            >
                                <Text.P
                                    style={{
                                        color: theme.primary,
                                    }}
                                >
                                    Done
                                </Text.P>
                            </View>
                        </Pressable>
                    </InputAccessoryView>
                                ) : null*/}
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
const Datetime = ({ onChangeText, mode, ...props }) => {
    const theme = useTheme();
    let isIOS = Platform.OS === "ios"
    const [date, setDate] = useState(props.value? new Date(props.value) : new Date((Date.now()) ));
    const [display,setDisplay] = useState(false);
    const [displayAndroidClock, setDisplayAndroidClock] = useState(false)
    //console.log({displayAndroidClock, android: !isIOS})
    return (
        <>
           {(isIOS || display) && (
            <DateTimePicker
                {...props}
                mode={
                    isIOS? mode : (mode == "datetime" &&  displayAndroidClock)? "time" : "date"
                }
                value={date}
                accentColor={theme.primary_contrast}
                onChange={(event, dateChosen) => {
                    console.log("date chosen" , event.nativeEvent.timestamp );
                    //if(event.type === "dismissed")
                    onChangeText({
                        date: dateChosen,
                        timestamp: event.nativeEvent.timestamp,
                    });
                    setDate(dateChosen)
                    if(isIOS || mode != "datetime") return setDisplay(false);
                    if(!displayAndroidClock) return setDisplayAndroidClock(true)
                    setDisplay(false);
                    setDisplayAndroidClock(false);
                }}
            ></DateTimePicker>) }

                {!isIOS && (
                <>
                <Text.P>{getDateFormatted(defaultValue)}</Text.P>
                <Button onPress={() => setDisplay(true)}>select date</Button>
                </>)}
        </>
    );
};
const Maps = ({onChangeText,  ...props}) =>{
    const theme = useTheme();
    const {message} = useMessage()
    const  {onTouch}= useTouch();
    const [places, setPlaces] = useState([])
    const [error, setError] = useState(false);
    const [text, setText] = useState( props.value || props.defaultValue || "");
    const autocomplete = async (t) =>{
        setText(t)
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
    useEffect(()=>{
        
        //console.log(text, places)
        if(text && !places) {
            message.error("Invalid place")
            setError(true)
        }
        setPlaces([]);
    },[onTouch])
    const handleSetLocation = (place) =>{
        //console.log(place.name);
        setText(place.name)
        onChangeText(place);
        setPlaces([])
        setError(false)
    }
    return (
        <View>
            <DefaultInput
                {...props}
                
                onChangeText={autocomplete}
                error={error}
                value={text}
            ></DefaultInput>

            <ScrollView
                keyboardShouldPersistTaps="handled"
                style={{
                    backgroundColor: theme.medium,
                    padding: places.length > 0 ? 10 : 0,
                    borderTopColor: "black",
                    borderTopWidth: places.length > 0 ? 1 : 0,
                }}
            >
                {places
                    ? places?.map((place) => {
                          return (
                              <Pressable
                                  key={place.name}
                                  onPress={() => handleSetLocation(place)}
                                  style={{
                                      padding: 10,
                                      borderBottomColor:
                                          theme.transparent.light,
                                      borderBottomWidth: 1,
                                  }}
                              >
                                  <TextOut.P
                                      style={{ color: theme.foreground }}
                                  >
                                      {place.name}
                                  </TextOut.P>
                              </Pressable>
                          );
                      })
                    : null}
            </ScrollView>
        </View>
    );
}


Input.Textarea = Textarea;
Input.Text = DefaultInput;
Input.Maps = Maps;
Input.Number = Number;
Input.Date = Datetime;
export default Input