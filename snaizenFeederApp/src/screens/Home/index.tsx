import React, { useCallback, useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";
import { BorderlessButton, GestureHandlerRootView } from "react-native-gesture-handler";
import { Avatar } from "../../components/Avatar";
import { Background } from "../../components/Background";
import { ButtonAdd } from "../../components/ButtonAdd";
import { ListDivider } from "../../components/ListDivider";
import { ListHeader } from "../../components/ListHeader";
import { Loading } from "../../components/Loading";
import { Schedule } from "../../components/Schedule";
import { theme } from "../../global/styles/theme";
import { useSchedules } from "../../hooks/schedules";

import AsyncStorage  from "@react-native-async-storage/async-storage";

import { styles } from "./styles";
import { COLLECTION_DEVICE } from "../../configs/database";
import { DeviceProps } from "../ConnectionScreen";
import { useFocusEffect } from "@react-navigation/native";

type Props = {
    navigation: {
        navigate: Function
    };
}

export function Home({navigation: {navigate}}: Props){
    const {schedules,deleteSchedule,loadSchedules} = useSchedules();
    const [isDeviceConnected, setIsdeviceConnected] = useState(true);

    function handleScheduleCreate(){
        navigate("ScheduleCreate");
    };

    function handleScheduleEdit(id: string){
        navigate("ScheduleEdit",{id: id})
    };
    
    function handleScheduleDelete(id : string){
       deleteSchedule(id);
    }    

    const {on, primary} = theme.colors;
    const [loading,setLoading] = useState(true);

    function handleConnection(){
        navigate("ConnectionScreen")
    }

    async function getDevice() {
        const response = await AsyncStorage.getItem(COLLECTION_DEVICE);
        const storage: DeviceProps = response ? JSON.parse(response).device : {isDeviceConnected: false};
        setIsdeviceConnected(storage.isDeviceConnected);
    }

    useFocusEffect(useCallback(()=>{
        loadSchedules();
        getDevice();
        setLoading(false);
    },[]))

    return(
        <Background>
            <View style={styles.header}>
                <Avatar urlImage="https://github.com/henrique-pignatari.png"/>
                <GestureHandlerRootView>
                    <BorderlessButton onPress={handleConnection}>
                        <Text style={[styles.status, {color: isDeviceConnected? on : primary }]}>
                            {
                                console.log(new Blob([JSON.stringify(schedules)]).size)
                            }
                            {
                                console.log(JSON.stringify(schedules))
                            }
                            {
                                isDeviceConnected? "Conectado" : "Desconectado"
                            }
                        </Text>    
                    </BorderlessButton>
                </GestureHandlerRootView>
                <ButtonAdd onPress={handleScheduleCreate}/>
            </View>

            {
                loading ?
                <Loading/>
                :
                <>
                    <ListHeader title="Horarios agendados" subtitle={`Total ${schedules.data.length}`}/>
                    <FlatList
                        data={schedules.data}
                        keyExtractor={item => item.id}
                        renderItem={({item})=> (
                            <Schedule
                                handlers={{handleScheduleEdit,handleScheduleDelete}}
                                data={item}
                            />
                        )}
                        ItemSeparatorComponent={() => <ListDivider/>}
                        style={styles.schedules}
                        showsVerticalScrollIndicator={false}
                    />
                </>
            }
        </Background>
    )
}