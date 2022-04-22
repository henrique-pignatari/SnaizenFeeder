import { StyleSheet } from "react-native";
import { theme } from "../../global/styles/theme";

export const styles = StyleSheet.create({
    btn:{
        width: 150,
        height: 50,
        borderRadius: 8,
        borderColor: theme.colors.line,
        borderWidth: 1,
        alignItems: "center",
        paddingVertical: 9,
    },

    btnTitle:{
        fontSize:20,
        fontFamily: theme.fonts.text400,
        color: 'white'
    }

})