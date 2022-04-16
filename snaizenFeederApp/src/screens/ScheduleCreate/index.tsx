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
    navigation: {
        navigate: Function
    };
}

export function ScheduleCreate({navigation: {navigate}}: Props){
    const {schedules,addSchedule,reagengeSchedules,setSchedules} = useSchedules();
    const [hour,setHour] = useState('');
    const [minute,setMinute] = useState('');
    const [weight,setWeight] = useState('');
    
    function createSchedule(){
        const schedule = {
            id: '',
            hour: `${hour}:${minute}`,
            weight,
        };

        setSchedules({data: reagengeSchedules(addSchedule(schedule))});
        navigate('Home')
    }

    return(
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ?  'padding' : 'height'}
        >
            <ScrollView>
                <Header
                    title="Criar novo horario"
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
                                    onChangeText={setHour}
                                />
                                <Text style={styles.divider}>
                                    :
                                </Text>
                                <SmallInput 
                                    maxLength={2}
                                    onChangeText={setMinute}
                                />
                            </View>
                        </View>

                        <View style={{alignItems: "center"}}>
                            <Text style={styles.label}>
                                Peso
                            </Text>

                            <View style={styles.column}>
                                <MediumInput 
                                    maxLength={2}
                                    onChangeText={setWeight}    
                                />
                            </View>
                        </View>
                    </View>
                    <GestureHandlerRootView>
                        <RectButton 
                            style={styles.confirmButton}
                        >
                            <Text
                                style={styles.confirmText}
                                onPress={createSchedule}
                            >Confirmar</Text>
                        </RectButton>
                    </GestureHandlerRootView>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}