import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, Text, View } from "react-native";
import { GestureHandlerRootView, RectButton, ScrollView } from "react-native-gesture-handler";
import { Header } from "../../components/Header";
import { MediumInput } from "../../components/MediumInputt";
import { ScheduleProps } from "../../components/Schedule";
import { SmallInput } from "../../components/SmallInput";
import { useSchedules } from "../../hooks/schedules";

import { styles } from "./styles";
type Props = {
    route: {
        params: {
            id : string;
        }
    }
    navigation: {
        navigate: Function
    };
}

export function ScheduleEdit({route:{params:{id}},navigation: {navigate}}: Props){
    const {schedules,editSchedule} = useSchedules();
    const schedule =schedules.data.find(item =>{return item.id === id}) as ScheduleProps;
    const hourArr = schedule.hour.split(':');

    const [hour,setHour] = useState(hourArr[0]);
    const [minutes,setMinutes] = useState(hourArr[1]);
    const [weight,setWeight] = useState(schedule.weight);
    
    function handleScheduleEdit(){
        const newSchedule = {
            id: '',
            hour: `${hour}:${minutes}`,
            weight,
        };
        editSchedule(id,newSchedule);
        navigate('Home');
    }

    return(
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ?  'padding' : 'height'}
        >
            <ScrollView>
                <Header
                    title="Modificar o horario"
                />
                <View style={styles.container}>
                    <View style={styles.field}>
                        <View>
                            <Text style={styles.label}>
                                Hora e minuto
                            </Text>

                            <View style={styles.column}>
                                <SmallInput 
                                    maxLength={2} 
                                    value={hour}
                                    onChangeText={setHour}
                                />
                                <Text style={styles.divider}>
                                    :
                                </Text>
                                <SmallInput 
                                    maxLength={2} 
                                    value={minutes}
                                    onChangeText={setMinutes}
                                />
                            </View>
                        </View>

                        <View style={{alignItems: "center"}}>
                            <Text style={styles.label}>
                                Peso
                            </Text>

                            <View style={styles.column}>
                                <MediumInput 
                                    maxLength={5} 
                                    value={weight}
                                    onChangeText={setWeight}
                                />
                            </View>
                        </View>
                    </View>
                    <GestureHandlerRootView>
                        <RectButton 
                            style={styles.confirmButton}
                            onPress={handleScheduleEdit}
                        >
                            <Text style={styles.confirmText}>Confirmar</Text>
                        </RectButton>
                    </GestureHandlerRootView>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}