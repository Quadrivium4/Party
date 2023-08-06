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

const Carusel = ({ images, i = 0, closeModal }) => {
    console.log({ i });
    const [index, setIndex] = useState(i);
    const theme = useTheme();
    const [touch, setTouch] = useState({ x: 0, y: 0 });
    let t = {
        x: 0,
        y: 0,
    };
    let start = 0;
    let offset = i * Dimensions.get("window").width;
    const carusel = useRef();
    const scrollLeft = () => {
        console.log("scrolling left...", { index, images });
        if (!index > 0) return;

        carusel.current.scrollToIndex({
            index: index - 1,
        });
        setIndex(index - 1);
    };
    const scrollRight = () => {
        console.log("scrolling right...", { index, images });
        if (!(index < images.length - 1)) return;

        carusel.current.scrollToIndex({
            index: index + 1,
        });
        setIndex(index + 1);
    };
    const noScroll = () =>{
        carusel.current.scrollToIndex({index})
    }
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
                    backgroundColor: "red",
                    justifyContent: "center",
                }}
            >
                <Animated.FlatList
                    ref={carusel}
                    horizontal={true}
                    keyExtractor={(item) => item}
                    //onLayout={()=> carusel.current.scrollToIndex({index: i})}
                    initialScrollIndex={i}
                    onTouchStart={(e) => {
                        console.log(t);
                        start = e.nativeEvent.pageX;
                        t.x = e.nativeEvent.pageX;
                        //carusel.current.scrollToOffset(offset)
                        console.log("touch start", t.x);
                    }}
                    onTouchEnd={(e) => {
                        console.log(t);
                        let x = e.nativeEvent.pageX;
                        console.log("touch end", start - x);
                        if (start - x > 40) {
                            console.log("left");
                            return scrollRight();
                        }
                        if (start - x < -40) {
                            console.log("right");
                            return scrollLeft();
                        }
                        return noScroll()
                    }}
                    getItemLayout={(data, index) => {
                        return {
                            length: Dimensions.get("window").width,
                            offset: Dimensions.get("window").width * index,
                            index,
                        };
                    }}
                    decelerationRate={1}
                    data={images}
                    style={{
                        height: "auto",
                        backgroundColor: "red",
                        flexGrow: 0,
                    }}
                    renderItem={({ item, index }) => {
                        return (
                            <Image
                                source={{
                                    uri: baseUrl + "/file/" + item,
                                }}
                                style={{
                                    width: Dimensions.get("window").width,
                                    height: "auto",
                                    aspectRatio: 3 / 3,
                                }}
                            ></Image>
                        );
                    }}
                ></Animated.FlatList>

                <Pressable
                    onPress={scrollLeft}
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
                    onPress={scrollRight}
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
