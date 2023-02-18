import { View,Text,TextInput, TouchableOpacity,Keyboard,Alert,Image } from "react-native"
import { useState } from "react"
import SelectDropdown from 'react-native-select-dropdown'
import { 
    Dialog
} from "react-native-ui-lib";

import { styles } from "../../styles/styles"
import Spacer from "./Spacer"
import {
    auth,
    updateReadingDays,
    getReadDays,
    updateReadPages,
    updateTotalPagesStats
} from "../../firebase"
import { useNavigation } from "@react-navigation/native"


function getFebDays(year){
    let leapYear = (year%4==0 && year%100==0) || (year%400==0) ? true : false

    if(leapYear){
        return 29
    }
    return 28
}


export function Day({active,name,number,read}){

    let activeStyleText = active ? styles.todayText : ""
    let activeStyleContainer = active ? styles.todayContainer : ""
    let readInThatDay = read ? styles.readContainer :""

    return (
        <View style={styles.dayContainer}>
            <View style={styles.dayNameContainer}>
                <Text style={[styles.dayNameText]}>{name}</Text>
            </View>
            <View style={[styles.dayNumberContainer,readInThatDay, activeStyleContainer]}>
                <Text style={[styles.dayNumberText,activeStyleText]}>{number}</Text>
            </View>
            <Spacer height={10}/>
        </View>
    )
}

export default function CalendarComponent({books, userStatsId}){


    userStatsId = userStatsId.split(" ").join("")


    const navigator = useNavigation()

    const [addReading,setAddReading] = useState(false)
    const [readingId, setReadingId] = useState("")
    const d = new Date()

    let week = [
        {name:"M",date:1,month:1,year:1,day:1,active:false,read:false},
        {name:"T",date:2,month:1,year:1,day:2,active:false,read:false},
        {name:"W",date:3,month:1,year:1,day:3,active:false,read:false},
        {name:"T",date:4,month:1,year:1,day:4,active:false,read:false},
        {name:"F",date:5,month:1,year:1,day:5,active:false,read:false},
        {name:"S",date:6,month:1,year:1,day:6,active:false,read:false},
        {name:"S",date:7,month:1,year:1,day:0,active:false,read:false},
    ]

    let currYear = d.getFullYear()

    let months = [
        {name:"January", days:31, monthNumber:1},
        {name:"February", days:getFebDays(currYear), monthNumber:2},
        {name:"March", days:31, monthNumber:3},
        {name:"April", days:30, monthNumber:4},
        {name:"May", days:31, monthNumber:5},
        {name:"June", days:30, monthNumber:6},
        {name:"July", days:31, monthNumber:7},
        {name:"August", days:31, monthNumber:8},
        {name:"September", days:30, monthNumber:9},
        {name:"October", days:31, monthNumber:10},
        {name:"November", days:30, monthNumber:11},
        {name:"December", days:31, monthNumber:12}
    
    ]

    
    let todayDate = d.getDate()
    let todayDay = d.getDay()
    let currMonth = d.getMonth() + 1

    let actualDay = todayDay != 0 ? todayDate-todayDay : todayDate-7
    
    week.map(weekDay=>{
       weekDay.date = weekDay.date + actualDay
       weekDay.month = currMonth
       weekDay.year = currYear
       for(let i = 0;i<months.length;i+=1){
            if(weekDay.month == months[i].monthNumber && weekDay.date>months[i].days){
                weekDay.month += 1
                if(weekDay.month>12){
                    weekDay.year += 1
                    weekDay.month = 1
                    weekDay.date -= months[0].days
                }
                else{weekDay.date -= months[i].days}
            }
       }

        if(weekDay.day == todayDay && weekDay.date == todayDate){
            weekDay.active = true
        }
        

        const [read, setRead] = useState(false)
        
        getReadDays(auth.currentUser?.email)
        .then(res=>{
            
            setReadingId(res[0].data().id)
            res[0].data().readDays.map(day=>{
                
                dayAux = day.split("_")
                for(let i =0;i<dayAux.length;i+=1){
                    dayAux[i] = Number(dayAux[i])
                }

                

                if(dayAux[0]==weekDay.date && dayAux[1]==weekDay.month && dayAux[2]==weekDay.year){
                    setRead(true)
                }

            })
            
        })

        weekDay.read = read
    })

    const [bookSelected, setBookSelected] = useState("")
    const [pagesSelected, setPagesSelected] = useState(0)
    

    return(
        <View style={{alignItems:"center"}}>
            <View style={styles.weekContainer}>
                {week.map(weekDay=>{
                    return(
                        <Day key={weekDay.date} active={weekDay.active} name={weekDay.name} number={weekDay.date} read={weekDay.read}/>
                    )
                })}
            </View>

            <Spacer height={15}/>
            
            <View style={styles.updateReadingForm}>


                <Dialog
                    visible={addReading}
                    onDismiss={() => setAddReading(false)}
                    panDirection="DOWN"
                    overlayBackgroundColor="#f09b7d"
                    ViewStyle={{alignItems:"flex-start"}}
                    >
                    <Text style={{fontSize:20}}><Text style={{fontSize:24,fontWeight:"bold"}}>Information:</Text> By pressing <Text style={{fontStyle:"italic"}}>Select a book</Text> you can choose from wich book you've read. This is important because if you have more than one book in you library you can see how many pages you've read in total. Below you have a <Text style={{fontStyle:"italic"}}>text input</Text> where you write how many pages you've read. After completing every field click <Text style={{fontStyle:"italic"}}>Update!</Text> </Text>
                    <Spacer height={10}/>
                    <Text style={{fontStyle:"italic",color:"#636160"}}> *Click anywhere to exit the dialog.</Text> 
                </Dialog>


                <View style={{justifyContent:"flex-start",width:"100%",backgroundColor:"#5c5654",flexDirection:"row",alignItems:'center',paddingTop:10}}>
                    <Text style={{fontSize:20,fontWeight:"bold",paddingLeft:20,color:"white"}}>Update reading:</Text>
                    <View style={{paddingLeft:10,color:"white"}}>
                        <TouchableOpacity onPress={()=>setAddReading(true)}>
                            <Image style={{height:20,width:20}} source={require("../../styles/images/information.png")}/>
                        </TouchableOpacity>
                    </View>
                </View>

                <Spacer height={10}/>

                <SelectDropdown 
                    data={books.map(book=>{return book.title})}
                    defaultButtonText="Select a book"
                    onSelect={option => {
                        setBookSelected(option)
                    }}
                    buttonStyle={styles.dropdownBtnStyle}
                    buttonTextStyle={styles.dropdownBtnTextStyle}
                />
                <Spacer height={5}/>
                <TextInput
                    placeholder="Pages"
                    value={pagesSelected}
                    onChangeText={text=>setPagesSelected(text)}
                    keyboardType="numeric"
                    style={styles.inputBookAdding}
                />
                <Spacer height={5}/>
                <TouchableOpacity
                    style={styles.updateBtn}
                    onPress={()=>{
                        
                        if(bookSelected!="" && pagesSelected!=0){

                            const d = new Date()
                            let day = parseInt(d.getDate() / 10) == 0 ? "0"+String(d.getDate()) : String(d.getDate())
                            let month = parseInt((d.getMonth()+1) / 10) == 0 ? "0"+String(d.getMonth()+1) : String(d.getMonth()+1)
                            let year = String(d.getFullYear())
                            let today = day+"_"+month+"_"+year
                            
                            day = Number(day)
                            month = Number(month)
                            year = Number(year)

                            let ok = true

                            week.map(weekDay=>{
                                if(weekDay.day == day && weekDay.month == month && weekDay.year == year && weekDay.read == true){
                                    ok = false
                                }
                            })
                            
                            if(ok){
                                updateReadingDays(today,readingId)
                                updateTotalPagesStats(userStatsId,pagesSelected)
                            }

                            books.map(book=>{
                                if(book.title == bookSelected){
                                    updateReadPages(book.bookId, pagesSelected)
                                }   
                            })
                            

                            Alert.alert(
                                "Congrats!",
                                "Today you read another "+pagesSelected+" pages from "+bookSelected,
                                [
                                    {
                                        text:"Nice!",
                                        style:"default",
                                        onPress:()=>{
                                            //navigator.replace("HomeScreen")
                                        }
                                    }
                                ]
                            )
                        }else if(bookSelected=="" && pagesSelected==0){
                            alert("You can't submit an empty form!")
                        }
                        else if(bookSelected==""){
                            alert("You can't submit with no book!")
                        }else if(pagesSelected==0){
                            alert("You can't submit 0 pages")
                        }

                        setPagesSelected(0)
                        Keyboard.dismiss()
                    }}
                >
                    <Text style={{fontSize:16,fontWeight:"bold"}}>Update!</Text>
                </TouchableOpacity>
            </View>
        </View>
    )

}