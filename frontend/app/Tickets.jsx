import { StyleSheet,View, ScrollView, KeyboardAvoidingView, TextInput, SafeAreaView, Keyboard, Linking, } from 'react-native';
import {NavigationContainer, Link, useNavigation, useFocusEffect} from "@react-navigation/native";
import {useState, useEffect, useCallback} from "react";
import { useAuth, useAuthDispatch } from '../context/AuthContext';
import Text from "../components/Text";
import Button from '../components/Button';
import Input from '../components/Input';
import ShiftingView from '../components/ShiftingView';
import { postParty } from '../controllers/party';
import { getOnboardingLink } from '../controllers/payment';
import { getTickets } from '../controllers/tickets';
import { AButton } from '../components/A';

const Tickets = ({route}) =>{
    const {logout, user} = useAuth();
    const dispatch = useAuthDispatch();
    const [tickets, setTickets] = useState();
    const [loading, setLoading] = useState(true);
    const [hello, setHello] = useState();

    useFocusEffect(
        //console.log(tickets)
        useCallback(()=>{
            if(tickets == undefined || route.params?.reload){
                getTickets().then(res=>{
                    setTickets(res);
                    console.log(res)
                    setLoading(false)
                })
            }
            return setTickets
        },[])
    )

    return (
        <View>
            <Text.H1>Your Tickets{hello}</Text.H1>
            {
                loading ? <Text.P>loading</Text.P> :
                    !tickets? <Text.P>You have no tickets</Text.P> : 
                    tickets.map(ticket=>{
                        console.log(ticket)
                        return <View key={ticket._id}> 
                            <Text.H2>{ticket.name}</Text.H2>
                            <AButton to={"ChatRoom"} params={{chatId: ticket.chat}}>go to chat</AButton>
                        </View>
                    })
            }
        </View>
    )
}
export default Tickets