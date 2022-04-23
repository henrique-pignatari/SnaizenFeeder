import React from "react";
import { View, Text, ScrollView } from "react-native";

import AsyncStorage  from "@react-native-async-storage/async-storage";
import {COLLECTION_SCHEDULES } from "../../configs/database";
import { ConnectionButton } from "../../components/ConnectionButton";

import { useDevice } from "../../hooks/device";

import { styles } from "./styles";
import { theme } from "../../global/styles/theme";

export function ConnectionScreen(){
    const {on,primary} = theme.colors;
    const {isConnected,message,scanDevices,disconnectDevice,sendMessage,}= useDevice();

    async function handleSend(){
        const response= await AsyncStorage.getItem(COLLECTION_SCHEDULES) as string;
        const data = `d${(response.split('[')[1].split(']')[0])}`;
        //const data = 'd{"id":"1","hour":"08:36","weight":"25"},{"id":"2","hour":"12:66","weight":"3"},{"id":"3","hour":"15:36","weight":"25"},{"id":"4","hour":"16:25","weight":"3"},{"id":"5","hour":"26:12","weight":"39"},{"id":"5","hour":"26:12","weight":"39"},{"id":"5","hour":"26:12","weight":"39"},{"id":"5","hour":"26:12","weight":"39"},{"id":"5","hour":"26:12","weight":"39"},{"id":"5","hour":"26:12","weight":"39"},{"id":"5","hour":"26:12","weight":"39"},{"id":"5","hour":"26:12","weight":"39"},{"id":"5","hour":"26:12","weight":"39"},{"id":"5","hour":"26:12","weight":"39"},{"id":"5","hour":"26:12","weight":"39"},{"id":"5","hour":"26:12","weight":"39"},{"id":"5","hour":"26:12","weight":"39"},{"id":"5","hour":"26:12","weight":"39"},{"id":"5","hour":"26:12","weight":"39"},{"id":"5","hour":"26:12","weight":"39"},{"id":"5","hour":"26:12","weight":"39"},{"id":"5","hour":"26:12","weight":"39"},{"id":"5","hour":"26:12","weight":"39"}.{"id":"5","hour":"26:12","weight":"39"},{"id":"1","hour":"08:36","weight":"25"},{"id":"2","hour":"12:66","weight":"3"},{"id":"3","hour":"15:36","weight":"25"},{"id":"4","hour":"16:25","weight":"3"},{"id":"5","hour":"26:12","weight":"39"},{"id":"5","hour":"26:12","weight":"39"},{"id":"5","hour":"26:12","weight":"39"},{"id":"5","hour":"26:12","weight":"39"},{"id":"5","hour":"26:12","weight":"39"},{"id":"5","hour":"26:12","weight":"39"},{"id":"5","hour":"26:12","weight":"39"},{"id":"5","hour":"26:12","weight":"39"},{"id":"5","hour":"26:12","weight":"39"},{"id":"5","hour":"26:12","weight":"39"},{"id":"5","hour":"26:12","weight":"39"},{"id":"5","hour":"26:12","weight":"39"},{"id":"5","hour":"26:12","weight":"39"},{"id":"5","hour":"26:12","weight":"39"},{"id":"5","hour":"26:12","weight":"39"},{"id":"5","hour":"26:12","weight":"39"},{"id":"5","hour":"26:12","weight":"39"},{"id":"5","hour":"26:12","weight":"39"},{"id":"5","hour":"26:12","weight":"39"}.{"id":"5","hour":"26:12","weight":"39"},{"id":"1","hour":"08:36","weight":"25"},{"id":"2","hour":"12:66","weight":"3"},{"id":"3","hour":"15:36","weight":"25"},{"id":"4","hour":"16:25","weight":"3"},{"id":"5","hour":"26:12","weight":"39"},{"id":"5","hour":"26:12","weight":"39"},{"id":"5","hour":"26:12","weight":"39"},{"id":"5","hour":"26:12","weight":"39"},{"id":"5","hour":"26:12","weight":"39"},{"id":"5","hour":"26:12","weight":"39"},{"id":"5","hour":"26:12","weight":"39"},{"id":"5","hour":"26:12","weight":"39"},{"id":"5","hour":"26:12","weight":"39"},{"id":"5","hour":"26:12","weight":"39"},{"id":"5","hour":"26:12","weight":"39"},{"id":"5","hour":"26:12","weight":"39"},{"id":"5","hour":"26:12","weight":"39"},{"id":"5","hour":"26:12","weight":"39"},{"id":"5","hour":"26:12","weight":"39"},{"id":"5","hour":"26:12","weight":"39"},{"id":"5","hour":"26:12","weight":"39"},{"id":"5","hour":"26:12","weight":"39"},{"id":"5","hour":"26:12","weight":"39"}.{"id":"5","hour":"26:12","weight":"39"},{"id":"1","hour":"08:36","weight":"25"},{"id":"2","hour":"12:66","weight":"3"},{"id":"3","hour":"15:36","weight":"25"},{"id":"4","hour":"16:25","weight":"3"},{"id":"5","hour":"26:12","weight":"39"},{"id":"5","hour":"26:12","weight":"39"},{"id":"5","hour":"26:12","weight":"39"},{"id":"5","hour":"26:12","weight":"39"},{"id":"5","hour":"26:12","weight":"39"},{"id":"5","hour":"26:12","weight":"39"},{"id":"5","hour":"26:12","weight":"39"},{"id":"5","hour":"26:12","weight":"39"},{"id":"5","hour":"26:12","weight":"39"},{"id":"5","hour":"26:12","weight":"39"},{"id":"5","hour":"26:12","weight":"39"},{"id":"5","hour":"26:12","weight":"39"},{"id":"5","hour":"26:12","weight":"39"},{"id":"5","hour":"26:12","weight":"39"},{"id":"5","hour":"26:12","weight":"39"},{"id":"5","hour":"26:12","weight":"39"},{"id":"5","hour":"26:12","weight":"39"},{"id":"5","hour":"26:12","weight":"39"},{"id":"5","hour":"26:12","weight":"39"}.{"id":"5","hour":"26:12","weight":"39"}'
        if(data.length >= 600){
            let index = 0;
            for(let i = 0; i <data.length ;i+=index){
                if(i+index > data.length){
                    sendMessage(`a${data.substring(i)}f`);
                    break;
                }
                let b = data.substring(i,i+599);
                for(let j = 600; j>0; j--){
                    if(b[j] === '{'){
                        index = j;
                        break;
                    }
                }
                sendMessage(`a${data.substring(i,i+index)}`)
            }
        }else{
            sendMessage(`a${data}f`);
        }
    }

    async function handleRecieve(){
        sendMessage('b');
    }

    return(
        <View style={styles.container}>
            <Text style={[styles.status,{color: isConnected? on : primary}]}>
                {isConnected? "Conectado" : "Desconectado"}
            </Text>
            <View style={styles.btnRow}>
                <ConnectionButton
                    onPress={()=>{scanDevices()}}
                    title="Conectar" 
                    style={{backgroundColor: on}}

                />
                <ConnectionButton
                    onPress={()=>{disconnectDevice()}}
                    title="Desconectar"
                    style={{backgroundColor: primary}}
                />
            </View>
            <View style={styles.btnRow}>
                <ConnectionButton
                    onPress={()=>{handleSend()}}
                    title="Enviar"
                    style={{backgroundColor: '#351cd9'}}
                />
                <ConnectionButton
                    onPress={()=>{handleRecieve()}}
                    title="Receber"
                    style={{backgroundColor: '#8f49de'}}
                />
            </View>
            <ScrollView>
                <Text style={styles.infoText}>
                    {`Weight: ${message}`}
                </Text>
            </ScrollView>
        </View>
    )
}