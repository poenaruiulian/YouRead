import { View,Text } from "react-native"
import { useState } from "react"

import { styles } from "../../styles/styles"
import Spacer from "./Spacer"
import {
    auth,
    updateReadingDays,
    getReadDays
} from "../../firebase"


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

export default function CalendarComponent(){

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

    return(
        <View style={styles.weekContainer}>
            {week.map(weekDay=>{
                return(
                    <Day active={weekDay.active} name={weekDay.name} number={weekDay.date} read={weekDay.read}/>
                )
            })}

        </View>
    )

}