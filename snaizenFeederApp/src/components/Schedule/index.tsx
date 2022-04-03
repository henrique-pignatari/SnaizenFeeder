import React from "react";
import { Text, View } from "react-native";
import { BorderlessButton, GestureHandlerRootView, RectButton, RectButtonProps } from "react-native-gesture-handler";

import { FontAwesome } from '@expo/vector-icons';

import { styles } from "./styles";
import { theme } from "../../global/styles/theme";

export type ScheduleProps = {
    id: string;
    hour: string;
    weight: string;
}

type Props = RectButtonProps & {
    data: ScheduleProps;
    handlers: {
        handleScheduleEdit:(id: string) => void,
        handleScheduleDelete:(id: string) => void,
    }
}

export function Schedule({
    data,
    handlers:{
        handleScheduleEdit, 
        handleScheduleDelete
    },
    ...rest
}: Props){
    return(
        <View style={styles.container}>
            <GestureHandlerRootView>
                <RectButton 
                    style={styles.scheduledTime}
                    onPress={()=>{handleScheduleEdit(data.id)}}
                >
                    <View style={styles.hourWeight}>
                        <Text style={styles.hour}>
                            {data.hour}
                        </Text>
                        <Text style={styles.weight}>
                            {`Peso: ${data.weight} KG`}
                        </Text>
                    </View>
                </RectButton>
            </GestureHandlerRootView>
            <GestureHandlerRootView>
                <BorderlessButton 
                    style={styles.deleteButton}
                    onPress={()=>{handleScheduleDelete(data.id);}}    
                >
                    <FontAwesome
                        name="trash-o"
                        size={30}
                        color="white"
                    />
                </BorderlessButton>
            </GestureHandlerRootView>
        </View>
    )
}