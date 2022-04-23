import { StyleSheet } from "react-native";
import { getStatusBarHeight } from "react-native-iphone-x-helper";
import { theme } from "../../global/styles/theme";

export const styles = StyleSheet.create({
    container: {
    },
    status:{
        marginTop: getStatusBarHeight() + 10,
        fontFamily: theme.fonts.title500,
        fontSize: 30,
        alignSelf: "center",
        marginRight: 6,
    },

    btnRow: {
        width: '100%',
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 24,
        marginTop: 40,
    },
    infoText: {
        fontFamily: theme.fonts.title500,
        fontSize: 16,
        color: theme.colors.highlight,
    }
})