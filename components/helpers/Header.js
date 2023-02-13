import { View,Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

import Spacer from "./Spacer";

export default function Header({dest}){

    const navigator = useNavigation()

    return (
        <View style={{
            height:40,
            width:"100%",
            paddingLeft:15,
        }}>
            <Spacer height={25}/>
            <TouchableOpacity
                onPress={()=>{navigator.replace(dest)}}
            >
                <Image source={require("../../styles/images/back_arrow.png")}
                    style={{
                        height:30,
                        width:30,
                        
                    }}
                />
            </TouchableOpacity>
        </View>
    )
}