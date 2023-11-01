import { StyleSheet,View, Pressable, TextInput, Keyboard, Platform, ScrollView,TextInputProps,StyleProp, TextStyle, } from 'react-native';
import {NavigationContainer, Link, useNavigation} from "@react-navigation/native";
import {useState, useEffect, ChangeEvent } from "react";
import { useAuth} from '../context/AuthContext';
import {GeoapifyGeocoderAutocomplete, GeoapifyContext} from  "@geoapify/react-geocoder-autocomplete"
import { crossing, getDateFormatted } from '../utils';
import Select from './Select';
import TextOut  from "./Text"
import { TThemeProps, useTheme } from '../context/ThemeContext';
import DateTimePicker from "@react-native-community/datetimepicker";
import * as Crypto from "expo-crypto";
import Button from './Button';
import Text from './Text';
import { useTouch } from '../context/TouchContext';
import { useMessage } from '../context/MessageContext';

type TDefaultInputProps = TextInputProps & {
    error?: boolean,
}
const getInputStyles = (theme: TThemeProps): TextStyle =>({
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 10,
        paddingHorizontal: 10,
        color: theme.foreground,
        borderBottomColor: theme.transparent.light,
        borderBottomWidth: 1,
    });

const useInput = () =>{
    const theme = useTheme();
    const [state, setState] = useState({ error: false, focus: false })
    const borderBottomColor =   state.focus? theme.foreground : 
                                state.error? "rgb(255, 100,100)" : 
                                theme.transparent.light
    const styles = {
        ...getInputStyles(theme),
        borderBottomColor
    };
    const setError = (bool: boolean) => setState({...state, error: bool})
    const setFocus = (bool: boolean) => setState({...state, focus: bool})
    return {
        styles,
        setFocus,
        setError,
    }
}
const DefaultInput = ({error, ...props}: TDefaultInputProps)=>{
        const theme = useTheme();
        const uniqueId = Crypto.randomUUID()
        const { styles, setError, setFocus } = useInput();
        useEffect(()=>{
            //console.log("error changed", {error})
            if(error) setError(error)
        },[error])
        
        const newProps:TextInputProps = {
            ...props,
            onFocus: () => setFocus(true),
            onBlur: () => setFocus(false),
            style: styles,
            inputAccessoryViewID: uniqueId,
            autoCorrect: false,
            spellCheck: false,
            placeholderTextColor: theme.transparent.medium,
            keyboardAppearance: theme.isDark ? "dark" : "light",
        }; 

        return <TextInput {...newProps}></TextInput>
}

const Number = ({defaultValue, value, onChangeNumber, ...props}: TextInputProps &{onChangeNumber: (n: number)=>void}) =>{
    const handleChange = (e:string) => onChangeNumber(parseInt(e));
    return <DefaultInput {...props} keyboardType='numeric' defaultValue={defaultValue?.toString()} value={(value?.toString())} onChangeText={handleChange}></DefaultInput>
}
const Textarea = (props:TextInputProps) =>{
    let style: TextStyle = {
        //height: Platform.OS === "ios"? 150 : null, 
        //textAlignVertical: Platform.OS === "android"? "top" : null
    }
    return <DefaultInput multiline={true} numberOfLines={10}  {...props} style={style}></DefaultInput>
}

type TDateTime = { 
    mode: "datetime" | "date" | "time", 
    onChangeDate: (milliseconds: number) => void
}
const Datetime = ({ onChangeDate, mode, ...props }: TextInputProps & TDateTime) => {
    const theme = useTheme();
    let isIOS = Platform.OS === "ios"
    const [date, setDate] = useState<Date>(props.value? new Date(props.value) : new Date((Date.now()) ));
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
                    if(event.type === "dismissed") return;
                    if(!dateChosen || !event.nativeEvent.timestamp ) return;
                    onChangeDate(event.nativeEvent.timestamp);
                    setDate(dateChosen)
                    if(isIOS || mode != "datetime") return setDisplay(false);
                    if(!displayAndroidClock) return setDisplayAndroidClock(true)
                    setDisplay(false);
                    setDisplayAndroidClock(false);
                }}
            ></DateTimePicker>) }

                {!isIOS && (
                <>
                <Text.P>{getDateFormatted(props.value)}</Text.P>
                <Button onPress={() => setDisplay(true)}>select date</Button>
                </>)}
        </>
    );
};
type TPlace = {
    name: string,
    coords: {x: number,y: number },
    country: string,
    county: string
}
const Maps = ({onChangePlace,  ...props}: TextInputProps & {onChangePlace: ({name, coords, country, county}: TPlace) => void}) =>{
    const theme = useTheme();
    const {message} = useMessage()
    const [places, setPlaces] = useState<TPlace[]>([])
    const [error, setError] = useState(false);
    const [text, setText] = useState( props.value || props.defaultValue || "");
    const autocomplete = async (t: string) =>{
        setText(t)
        let result = await crossing(`https://api.geoapify.com/v1/geocode/autocomplete?text=${t}&apiKey=3d65b7c6286c4cf5a7c0083a295de089`)
        //console.log(result)
        if(result?.features?.length > 0){
                //console.log("results number: ", result.features.length);
                let results: TPlace[] = [];
                result.features.forEach((place:any) =>{
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

    const handleSetLocation = (place: TPlace) =>{
        //console.log(place.name);
        setText(place.name)
        onChangePlace(place);
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

const Input = {
    Textarea: Textarea,
    Text: DefaultInput,
    Maps: Maps,
    Number:Number,
    Date: Datetime
}
export default Input