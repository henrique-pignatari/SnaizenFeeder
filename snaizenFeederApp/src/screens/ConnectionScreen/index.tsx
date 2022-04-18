import React, { useCallback, useEffect, useState } from "react";
import { View, Text } from "react-native";

import { styles } from "./styles";
import { theme } from "../../global/styles/theme";
import AsyncStorage  from "@react-native-async-storage/async-storage";
import { COLLECTION_DEVICE } from "../../configs/database";
import { useFocusEffect } from "@react-navigation/native";
import { ConnectionButton } from "../../components/ConnectionButton";

export type DeviceProps = {
    isDeviceConnected: boolean;
}

export function ConnectionScreen(){
    const {on,primary} = theme.colors;
    const [isDeviceConnected, setIsDeviceConnected] = useState(false)
    const [device,setDevice] = useState<DeviceProps>({isDeviceConnected})

    function changeConnectionState(state: boolean){
        setIsDeviceConnected(state);
    }

    async function getDevice() {
        const response = await AsyncStorage.getItem(COLLECTION_DEVICE);
        const storage = response? JSON.parse(response) : null;
        if(storage){
            setDevice(storage.device);
        }
    }

    async function setStorageDevice() {
        await AsyncStorage.setItem(COLLECTION_DEVICE,JSON.stringify({device}));
    }

    useFocusEffect(useCallback(()=>{
        setDevice({isDeviceConnected})
    },[isDeviceConnected]))

    useEffect(()=>{
        getDevice();
    },[])

    useFocusEffect(useCallback(()=>{
        setIsDeviceConnected(device.isDeviceConnected)
        setStorageDevice();
    },[device]));

    function tryConnect(){
        console.log("Conecting");
        changeConnectionState(true)
    }

    function tryDisconnect(){
        console.log("Disconecting");
        changeConnectionState(false)
    }

    function trySend(){
        console.log("Enviando schedules")
    };

    function tryReceive(){
        console.log("Recbendo Schedules");
    }

    return(
        <View style={styles.container}>
            <Text style={[styles.status,{color: isDeviceConnected? on : primary}]}>
                {device.isDeviceConnected? "Conectado" : "Desconectado"}
            </Text>
            <View style={styles.btnRow}>
                <ConnectionButton
                    onPress={tryConnect}
                    title="Conectar" 
                    style={{backgroundColor: on}}

                />
                <ConnectionButton
                    onPress={tryDisconnect}
                    title="Desconectar"
                    style={{backgroundColor: primary}}
                />
            </View>
            <View style={styles.btnRow}>
                <ConnectionButton
                    onPress={trySend}
                    title="Enviar"
                    style={{backgroundColor: '#351cd9'}}
                />
                <ConnectionButton
                    onPress={tryReceive}
                    title="Receber"
                    style={{backgroundColor: '#8f49de'}}
                />
            </View>
        </View>
    )
}