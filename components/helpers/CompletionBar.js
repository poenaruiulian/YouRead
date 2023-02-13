import { View,Text } from "react-native"

export function CompletionBar({total,completed}){
    let percentCompleted = Number(completed)/Number(total)*100
    let percent = String(parseFloat(percentCompleted).toFixed(2))
    return(
        <View
            style={{
                width:"100%",
                flexDirection:"row"
            }}
        >
            <Text
                style={{
                    fontWeight:"bold",
                }}
            >{percent}%    </Text>
            <View style={{
                backgroundColor:"#f7603e",
                width:"90%",
                borderRadius:10
            }}>
                {
                    Number(percent)!=0?
                        <View style={{
                            backgroundColor: "#ed8c66",
                            width:percent+"%",
                            borderRadius:10
                        }}>
                            <Text>  </Text>
                        </View>:
                    
                    <Text>  </Text>
                }
            </View>
        </View>
    )
}