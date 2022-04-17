import React, { useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";
import { Avatar } from "../../components/Avatar";
import { Background } from "../../components/Background";
import { ButtonAdd } from "../../components/ButtonAdd";
import { ListDivider } from "../../components/ListDivider";
import { ListHeader } from "../../components/ListHeader";
import { Loading } from "../../components/Loading";
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
    let {schedules,deleteSchedule,loadSchedules} = useSchedules();

    function handleScheduleCreate(){
        navigate('ScheduleCreate');
    };

    function handleScheduleEdit(id: string){
        navigate("ScheduleEdit",{id: id})
    };
    
    function handleScheduleDelete(id : string){
       deleteSchedule(id);
    }

    const {on, primary} = theme.colors;
    const [isDeviceConnected, setIsdeviceConnected] = useState(false);
    const [loading,setLoading] = useState(true);

    useEffect(()=>{
        loadSchedules();
        setLoading(false);
    },[])

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

            {
                loading ?
                <Loading/>
                :
                <>
                    <ListHeader title="Horarios agendados" subtitle={`Total ${3}`}/>
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