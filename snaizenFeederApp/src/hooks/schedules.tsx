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
    schedules: Schedules
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
            hour: '10:30',
            weight: '1',

        },
        {
            id: '4',
            hour: '10:30',
            weight: '1',

        },
        {
            id: '5',
            hour: '10:30',
            weight: '1',

        },
        {
            id: '6',
            hour: '10:30',
            weight: '1',

        },
        {
            id: '7',
            hour: '10:30',
            weight: '1',

        }
    ]} as Schedules);

    return(
        <SchedulesContext.Provider value={{schedules}}>
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