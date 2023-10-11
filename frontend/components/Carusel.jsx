import {
    StyleSheet,
    Animated,
    View,
    Dimensions,
    Image,
    Pressable,
    FlatList,
    TouchableWithoutFeedback,
    TouchableOpacity,
} from "react-native";
import { useState, useEffect, useRef } from "react";
import { baseUrl } from "../constants";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useTheme } from "../context/ThemeContext";
import * as Constants from "expo-constants";
import Text from "./Text";
import Loader from "./Loader";
const MyImage = ({image}) =>{
    const [loading, setLoading] = useState(true)
    return (
    <>
    <Image
            source={{
                uri: baseUrl + "/file/" + image.id,
            }}
            onLoad={()=>setLoading(false)}
            style={{
                width: Dimensions.get("window").width,
                height: "auto",
                aspectRatio: 3 / 3,
            
            }}
        ></Image>
        {loading? <Loader visible={loading}></Loader>: null}
    </>)
}
const Carusel = ({ images, i = 0, closeModal }) => {
    console.log({ images });
    const [index, setIndex] = useState(i);
    const theme = useTheme();
    const [itemLoading, setItemLoading] = useState(false);
    let t = {
        x: 0,
        y: 0,
    };
    
    let timeStart = 0;
    let previousVelocity =0;
    let offset = i * Dimensions.get("window").width;
    let scriptScroll = false;
    let start =  offset;
    const carusel = useRef();
    const scrollLeft = (num = 1) => {
        if (!index > 0) return;
        let indexToScroll = index - num;
        if(index -num < 0) indexToScroll = 0;
        //console.log("scrolling left...", { index, max: images.length -1, num});
        

        carusel.current.scrollToIndex({
            index: indexToScroll,
        });
        setIndex(indexToScroll);
    };
    const scrollRight = (num = 1) => {
        
        //console.log("scrolling right...", { index, max: images.length - 1, num});
        if (!(index < images.length - 1)) return;
        let indexToScroll = index + num;
        if (indexToScroll > images.length - 1) indexToScroll = images.length - 1;
        carusel.current.scrollToIndex({
            index: indexToScroll,

        });
        setIndex(indexToScroll);
    };
     const scrollP = (num = 1) => {

         carusel.current.scrollToIndex({
             index: num,
         });
         setIndex(num);
         scriptScroll = false;
         console.log(scriptScroll)
     };
    const noScroll = () => {
        carusel.current.scrollToIndex({ index });
    };
    return (
        <View
            style={{
                ...styles.centeredView,
                height: "100%",
                backgroundColor: "rgba(0,0,0, 0.5)",
            }}
        >
            <TouchableWithoutFeedback onPress={() => closeModal()}>
                <View
                    style={{
                        backgroundColor: "transparent",
                        height: "100%",
                        width: "100%",
                        position: "absolute",
                    }}
                ></View>
            </TouchableWithoutFeedback>
            <View
                style={{
                    justifyContent: "center",
                }}
            >
                <Animated.FlatList
                    ref={carusel}
                    horizontal={true}
                    keyExtractor={(item) => item.id}
                    //onLayout={()=> carusel.current.scrollToIndex({index: i})}
                    initialScrollIndex={i}
                    onTouchStart={(e) => {
                        //console.log(t);
                        t.x = e.nativeEvent.pageX;
                        timeStart = performance.now();
                        //carusel.current.scrollToOffset(offset)
                        //console.log("touch start", t.x);
                    }}
                    scrollEventThrottle={75}
                    onScroll={(e)=>{
                        if(scriptScroll) return;
                        let currentTime = timeStart - performance.now();
                        let currentVelocity = Math.abs((start - e.nativeEvent.contentOffset.x) / (currentTime/10));
                        
                        //console.log(currentVelocity, previousVelocity)
                        if(currentVelocity < 0.7 && previousVelocity > currentVelocity) {
                            console.log("slowing...")
                            let movement = e.nativeEvent.contentOffset.x;
                            console.log(movement);
                            const total = Math.round(
                                movement / Dimensions.get("window").width
                            );
                            console.log({ total });
                            scrollP(total)
                            
                        }
                        timeStart = performance.now();
                        start = e.nativeEvent.contentOffset.x;
                        previousVelocity = currentVelocity;
                    }}
                    
                    /*onMomentumScrollEnd={(e)=>{
                        console.log("scrolled end")
                        let x = e.nativeEvent.pageX;
                        let movement = e.nativeEvent.contentOffset.x;
                        console.log(movement)
                        const total = Math.round(
                            movement /
                                Dimensions.get("window").width
                        );
                        console.log({total});
                        //scrollP(total)
                    }}
                    onTouchEnd={(e) => {
                        //console.log(t);
                        let x = e.nativeEvent.pageX;
                        
                        let movement = start -x;
                        const timeSpended = Date.now() - timeStart;
                        let speed = movement /(timeSpended /1000 + 2);
                        let total = Math.abs(Math.round(speed/50));
                        //console.log("touch end", start - x);
                        const timeout = setTimeout(()=>{
                            if (movement > 40) {
                                console.log("left");
                                
                                return scrollRight(total);
                            }
                            if (movement< -40) {
                                console.log("right");
                                return scrollLeft(total);
                            }
                            return noScroll();
                        },400)
                        
                        
                    }}*/
                    getItemLayout={(data, index) => {
                        return {
                            length: Dimensions.get("window").width,
                            offset: Dimensions.get("window").width * index,
                            index,
                        };
                    }}
                    
                    data={images}
                    style={{
                        height: "auto",
                        flexGrow: 0,
                    }}
                    renderItem={({ item, index }) => {
                        console.log(item)
                        return (
                            <MyImage
                                image={item}
                            ></MyImage>
                        );
                    }}
                ></Animated.FlatList>

                <Pressable
                    onPress={()=>scrollLeft()}
                    style={{
                        position: "absolute",
                        backgroundColor: "rgba(0,0,0, 0.5)",
                        borderRadius: 50,
                        borderColor: "rgba(255,255,255,0.1)",
                        borderWidth: 2,
                        alignSelf: "flex-start",
                    }}
                >
                    <Icon
                        name="arrow-left-drop-circle-outline"
                        size={60}
                        color={index > 0 ? "rgb(220,220,220)" : "gray"}
                    />
                </Pressable>
                <Pressable
                    onPress={()=>scrollRight()}
                    style={{
                        position: "absolute",
                        backgroundColor: "rgba(0,0,0, 0.5)",
                        borderRadius: 50,
                        borderColor: "rgba(255,255,255,0.1)",
                        borderWidth: 2,
                        alignSelf: "flex-end",
                    }}
                >
                    <Icon
                        name="arrow-right-drop-circle-outline"
                        size={60}
                        color={
                            index < images.length - 1
                                ? "rgb(220,220,220)"
                                : "gray"
                        }
                    />
                </Pressable>
            </View>
        </View>
    );
};
const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: Constants.default.statusBarHeight,
    },
});
export default Carusel;
