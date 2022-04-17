import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { theme } from "../global/styles/theme";
import { Home } from "../screens/Home";
import { ScheduleEdit } from "../screens/ScheduleEdit";
import { ScheduleCreate } from "../screens/ScheduleCreate";
import { ConnectionScreen } from "../screens/ConnectionScreen";

const {Navigator, Screen} = createNativeStackNavigator();

export function AppRoutes(){
    return(
        <Navigator
            screenOptions={{
                contentStyle: {
                    backgroundColor: theme.colors.secondary100
                },
                headerShown:false,
            }}
        >
            <Screen
                name="Home"
                component={Home}
            />
            <Screen
                name="ScheduleEdit"
                component={ScheduleEdit}
            />
            <Screen
                name="ScheduleCreate"
                component={ScheduleCreate}
            />
            <Screen
                name="ConnectionScreen"
                component={ConnectionScreen}
            />
        </Navigator>
    )
};