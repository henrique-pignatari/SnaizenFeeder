import React from "react";
import { GestureHandlerRootView, RectButton, RectButtonProps } from "react-native-gesture-handler";
import { Text } from "react-native";

import { styles } from "./styles";

type Props = RectButtonProps & {
    title: string;
}

export function ConnectionButton({title,style,...rest}: Props){
    return(
    <GestureHandlerRootView>
        <RectButton {...rest} style={[style, styles.btn]}>
            <Text style={styles.btnTitle}>
                {title}
            </Text>
        </RectButton>
    </GestureHandlerRootView>
    )
}