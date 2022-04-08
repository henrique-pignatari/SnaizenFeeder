import React, { useState } from "react";
import { FlatList, Text, View } from "react-native";
import { Avatar } from "../../components/Avatar";
import { Background } from "../../components/Background";
import { ButtonAdd } from "../../components/ButtonAdd";
import { ListDivider } from "../../components/ListDivider";
import { ListHeader } from "../../components/ListHeader";
import { Schedule, ScheduleProps } from "../../components/Schedule";
import { theme } from "../../global/styles/theme";
import { useSchedules } from "../../hooks/schedules";

import { styles } from "./styles";

type Props = {
    navigation: {
        navigate: Function
    };
}

export function Home({navigation: {navigate}}: Props){
    let {addSchedule,reagengeSchedules,schedules,setSchedules} = useSchedules();

    const [render,setRender] = useState(true);

    function renderScreen(){
        setRender(!render)
    }

    function handleScheduleCreate(){
        const sche = {
            id: '',
            hour: '06:35',
            weight: '2'
        };
        setSchedules({data: reagengeSchedules(addSchedule(sche))})
        renderScreen();
    };

    function handleScheduleEdit(id: string){
        navigate("ScheduleEdit",{id: id})
    };
    
    function handleScheduleDelete(id : string){
        let a: number = +id;
        schedules.data.splice(a-1,1);
        reagengeSchedules(schedules.data);
        renderScreen()
    }

    const {on, primary} = theme.colors;
    const [isDeviceConnected, setIsdeviceConnected] = useState(false);

    return(
        <Background>
            <View style={styles.header}>
            <Avatar urlImage="https://github.com/henrique-pignatari.png"/>
            <Text style={[styles.status, {color: isDeviceConnected? on : primary }]}>
                {
                    isDeviceConnected? "Conectado" : "Desconectado"
                }
            </Text>    
                <ButtonAdd onPress={handleScheduleCreate}/>
            </View>

            <ListHeader title="Horarios agendados" subtitle="Total 3"/>
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
        </Background>
    )
}