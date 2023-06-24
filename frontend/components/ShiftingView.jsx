import { StyleSheet,View, Pressable, TextInput, Keyboard, Animated,Easing, ScrollView, Dimensions, UIManager, KeyboardAvoidingView, Platform, TouchableWithoutFeedback} from 'react-native';
import {NavigationContainer, Link, useNavigation} from "@react-navigation/native";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {useState, useEffect} from "react";
import { useAuth, useAuthDispatch } from '../context/AuthContext';
import Text from './Text';
const {State: TextInputState} = TextInput;
const ShiftingView= ({children}) =>{

    
    
    return (
        <KeyboardAwareScrollView keyboardShouldPersistTaps="handled">
            <TouchableWithoutFeedback onPress={()=>{ console.log("hello")}}>
                <ScrollView style={{ padding: 10}} keyboardShouldPersistTaps="always">
                    {children}
                </ScrollView>
            </TouchableWithoutFeedback>
        </KeyboardAwareScrollView>
            
        
    )
}


export default ShiftingView