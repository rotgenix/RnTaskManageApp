import Toast, { ToastPosition, ToastType } from "react-native-toast-message"

export const showToast = ({ type, position, text1, text2 }: {
    type?: ToastType,
    text1?: string,
    text2?: string,
    position?: ToastPosition
}) => {
    return Toast.show({
        type: type,
        text1: text1,
        text2: text2,
        autoHide: true,
        visibilityTime: 3000,
        position: position
    })
}