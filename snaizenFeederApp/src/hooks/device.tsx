import React, 
{
    createContext,
    ReactNode,
    useContext,
    useState
} from "react";
import { LogBox, PermissionsAndroid } from "react-native";
import AsyncStorage  from "@react-native-async-storage/async-storage";

import base64  from 'react-native-base64';
import { BleManager, Device } from 'react-native-ble-plx';
import { COLLECTION_SCHEDULES } from "../configs/database";

LogBox.ignoreLogs(['new NativeEventEmitter']);
LogBox.ignoreAllLogs();

const BLTManager = new BleManager();
const SERVICE_UUID = '4fafc201-1fb5-459e-8fcc-c5c9c331914b';
const MESSAGE_UUID = '6d68efe5-04b6-4a85-abc4-c2670b7bf7fd';

type DeviceContextData ={
    device: Device;
    message: string;
    isConnected: boolean;
    scanDevices: ()=>void;
    disconnectDevice: ()=>void;
    sendMessage: (value: string)=>Promise<void>;
}

type DeviceProviderProps ={
    children: ReactNode;
}

export const DeviceContext = createContext({} as DeviceContextData);

function DeviceProvider({children}: DeviceProviderProps){
    const [device, setDevice] = useState<Device>({} as Device);
    const [message, setMessage] = useState('');
    const [isConnected, setIsConnected] = useState(false);
    let dataReceived = '';

    async function scanDevices() {
        PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Permission Localisation Bluetooth',
            message: 'Requirement for Bluetooth',
            buttonNeutral: 'Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        ).then(answere => {

          BLTManager.startDeviceScan(null, null, (error, scannedDevice) => {
            if (error) {
              console.warn(error);
            }
    
            if (scannedDevice && scannedDevice.name == 'SnaizenFeeder') {
              BLTManager.stopDeviceScan();
              connectDevice(scannedDevice);
            }
          });
    
          // stop scanning devices after 5 seconds
          setTimeout(() => {
            BLTManager.stopDeviceScan();
          }, 5000);
        });
    }
    
    async function disconnectDevice() {

    if (device != null) {
        const isDeviceConnected = await device.isConnected();
        if (isDeviceConnected) {
            BLTManager.cancelTransaction('messagetransaction');
            BLTManager.cancelTransaction('nightmodetransaction');

            BLTManager.cancelDeviceConnection(device.id).then(() =>{});
        }

        const connectionStatus = await device.isConnected();
        if (!connectionStatus) {
            setIsConnected(false);
        }
    }
    }

    //Function to send data to ESP32
    async function sendMessage(value: string) {
        BLTManager.writeCharacteristicWithResponseForDevice(
            device?.id,
            SERVICE_UUID,
            MESSAGE_UUID,
            base64.encode(value),
        ).then(characteristic => {});
    }
    
    async function connectDevice(device: Device) {
        device
            .connect()
            .then(device => {
            setDevice(device);
            setIsConnected(true);
            return device.discoverAllServicesAndCharacteristics();
            })
            .then(device => {
            BLTManager.onDeviceDisconnected(device.id, (error, device) => {
                setIsConnected(false);
            });
            
            device.monitorCharacteristicForService(
                SERVICE_UUID,
                MESSAGE_UUID,
                (error, characteristic) => {
                    if (characteristic?.value != null) {
                        handleDataReceive(base64.decode(characteristic?.value));
                        //handleDataReceive(`{"id":"1","hour":"08:36","weight":"25"},{"id":"2","hour":"12:66","weight":"3"},{"id":"3","hour":"15:36","weight":"25"},{"id":"4","hour":"16:25","weight":"3"},{"id":"5","hour":"26:12","weight":"39"},{"id":"6","hour":"26:12","weight":"39"}f`);
                    }
                },
                'messagetransaction',
            );
        });

    }

    async function setSchedules(schedules: string) {
        setMessage(schedules);
        await AsyncStorage.setItem(COLLECTION_SCHEDULES,schedules);
    }

    function handleDataReceive(data: string){
        dataReceived+=data;
        setMessage(dataReceived);
        if(dataReceived.endsWith('f')){
            setSchedules(dataReceived.replace('f',''));
            dataReceived = '';
        }
    }

    return(
        <DeviceContext.Provider value={{device,isConnected,message,sendMessage,scanDevices,disconnectDevice}}>
            {children}
        </DeviceContext.Provider>
    )

}

function useDevice(){
    const context = useContext(DeviceContext)

    return context;
}

export{
    useDevice,
    DeviceProvider,
}