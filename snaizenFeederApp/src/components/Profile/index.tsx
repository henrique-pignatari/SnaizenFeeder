import React from "react";
import { Text, View } from "react-native";
import { theme } from "../../global/styles/theme";

import { Avatar } from "../Avatar";

import { styles } from "./styles";

type Props = { 
    deviceConnected: boolean
}
export function Profile({deviceConnected}: Props){
    const {on, primary} = theme.colors;
    return(
        <View style={styles.container}>
            <Avatar urlImage="https://github.com/henrique-pignatari.png"/>
            <Text style={[styles.status, {color: deviceConnected? on : primary }]}>
                {
                    deviceConnected? "Conectado" : "Desconectado"
                }
            </Text>        
        </View>
    )
}
