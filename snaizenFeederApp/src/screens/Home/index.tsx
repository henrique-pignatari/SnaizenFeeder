import React, { useState } from "react";
import { FlatList, Text, View } from "react-native";
import { Avatar } from "../../components/Avatar";
import { Background } from "../../components/Background";
import { ButtonAdd } from "../../components/ButtonAdd";
import { ListDivider } from "../../components/ListDivider";
import { ListHeader } from "../../components/ListHeader";
import { Profile } from "../../components/Profile";
import { Schedule } from "../../components/Schedule";
import { theme } from "../../global/styles/theme";

import { styles } from "./styles";

type Props = {
    navigation: {
        navigate: Function
    };
}

export function Home({navigation: {navigate}}: Props){
    const schedules = [
        {
            id: '1',
            hour: '12:30',
            weight: '2',

        },
        {
            id: '2',
            hour: '10:30',
            weight: '1',

        }
    ]

    function handleScheduleCreate(){
        console.log("Criando um horario");
    };

    function handleScheduleEdit(id: string){
        navigate("ScheduleEdit")
    };
    
    function handleScheduleDelete(id : string){
        console.log("Deletando o horario " + id);
        let a: number = +id;
        console.log(a)
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
                data={schedules}
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