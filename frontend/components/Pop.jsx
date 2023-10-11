import { ActivityIndicator, Modal, Pressable, TouchableWithoutFeedback, View, StyleSheet, Platform} from "react-native";
import { useTheme } from "../context/ThemeContext";
import { useEffect } from "react";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import * as Constants from "expo-constants";

const Pop = ({ visible, toggle, children, close }) => {
    const theme = useTheme();
    return (
        <>
            <Modal
                visible={visible}
                transparent={true}
                animationType="slide"
                style={{
                    position: "absolute",

                    left: 0,
                    right: 0,
                    bottom: 0,
                    top: 0,
                }}
                color={theme.primary}
                size="large"
            >
                <View style={{ ...styles.centeredView, padding: 20 }}>
                    <TouchableWithoutFeedback
                        onPress={() => {
                            toggle();
                            console.log("hei");
                        }}
                    >
                        <View
                            style={{
                                backgroundColor: "rgba(0,0,0,0.3)",
                                position: "absolute",
                                left: 0,
                                right: 0,
                                top: 0,
                                bottom: 0,
                            }}
                        ></View>
                    </TouchableWithoutFeedback>

                    <View
                        style={Platform.OS === "ios"? {...styles.ios, backgroundColor: theme.strong} : {...styles.android, backgroundColor: theme.strong}}
                    >
                        <Pressable
                            onPress={()=>toggle()}
                            style={{
                                width: "auto",
                                position: "absolute",
                                alignSelf: "flex-end",
								padding: 10,
								zIndex: 10

                            }}
                        >
                            <Icon
                                name="close-box-outline"
                                size={30}
                                color={theme.foreground}
                                style={{
                                    alignSelf: "flex-end",
                                }}
                                onPress={toggle}
                            ></Icon>
                        </Pressable>
                        
                        {children}
                    </View>
                </View>
            </Modal>
        </>
    );
};
const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
    },
    android: {
        width: "100%",
        borderColor: "rgba(255,255,255, 0.14)",
        borderRadius: 10,
        shadowColor: "white",
        padding: 15,
    }, 
    ios: {
        width: "100%",
        borderColor: "rgba(255,255,255, 0.14)",
        borderRadius: 10,
        shadowColor: "white",
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowRadius: 10,
        shadowOpacity: 0.2,
        padding: 15,
    }
});
export default Pop;
