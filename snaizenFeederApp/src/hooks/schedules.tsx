import React, 
{
    createContext,
    ReactNode,
    useContext,
    useState
} from "react";

import {ScheduleProps} from "../components/Schedule"

type Schedules = {
    data: (ScheduleProps)[]
}

type SchedulesContextData = {
    schedules: Schedules;
    setSchedules: (schedules: Schedules) => void
    addSchedule: (newSchedule: ScheduleProps) => (ScheduleProps)[];
    reagengeSchedules: (list: (ScheduleProps)[]) => (ScheduleProps)[]; 
    sortSchedules: () => (ScheduleProps)[];

}

type SchedulesProviderProps = {
    children: ReactNode
}

export const SchedulesContext = createContext({} as SchedulesContextData);

function SchedulesProvider({children}: SchedulesProviderProps){
    const [schedules, setSchedules] = useState<Schedules>({data:[
        {
            id: '1',
            hour: '12:30',
            weight: '2',

        },
        {
            id: '2',
            hour: '10:30',
            weight: '1',

        },
        {
            id: '3',
            hour: '13:30',
            weight: '1',

        },
        {
            id: '4',
            hour: '14:30',
            weight: '1',

        },
        {
            id: '5',
            hour: '15:40',
            weight: '1',

        },
        {
            id: '6',
            hour: '16:30',
            weight: '1',

        },
        {
            id: '7',
            hour: '17:30',
            weight: '1',

        }
    ]} as Schedules);

    function reagengeSchedules(list: (ScheduleProps)[]){
        list.map((item,i)=>{
            item.id = (i+1).toString();
        });
        return list;
    }

    function addSchedule( newSchedule: ScheduleProps){
        newSchedule.id = ((schedules.data.length)+1).toString();
        schedules.data.push(newSchedule);
        return sortSchedules();
    }
    
    function sortSchedules(){
        let schedulesNumberHours = schedules.data.map(item=>{
            let a = item.hour.split(':').map(item=>{
                let b: number = +item;
                return b
            })
            return ({id: item.id, hour: a[0]+(a[1]/100)})
        })
        schedulesNumberHours.sort((a,b)=>{return a.hour-b.hour});
        let bufferArr: (ScheduleProps)[];
    
        bufferArr= schedulesNumberHours.map((item) => {
            for (let i = 0; i < schedules.data.length; i++) {            
                if(item.id === schedules.data[i].id){
                    return schedules.data[i];
                }            
            }
            return {} as ScheduleProps
        })
        return bufferArr              
    }
    
    return(
        <SchedulesContext.Provider value={{schedules,setSchedules,addSchedule,reagengeSchedules, sortSchedules}}>
            {children}
        </SchedulesContext.Provider>
    )
}

function useSchedules(){
    const context = useContext(SchedulesContext);

    return context;
}


export{
    SchedulesProvider,
    useSchedules,
}