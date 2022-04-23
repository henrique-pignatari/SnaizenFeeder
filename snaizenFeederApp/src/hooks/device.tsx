import React, 
{
    createContext,
    ReactNode,
    useContext,
    useState
} from "react";
import { LogBox, PermissionsAndroid } from "react-native";

import base64  from 'react-native-base64';
import { BleManager, Device } from 'react-native-ble-plx';

LogBox.ignoreLogs(['new NativeEventEmitter']);
LogBox.ignoreAllLogs();

const BLTManager = new BleManager();
const SERVICE_UUID = '4fafc201-1fb5-459e-8fcc-c5c9c331914b';
const MESSAGE_UUID = '6d68efe5-04b6-4a85-abc4-c2670b7bf7fd';

type DeviceContextData ={
    device: Device;
    sendMessage: (value: string)=>Promise<void>;
    scanDevices: ()=>void;
    disconnectDevice: ()=>void;
    isConnected: boolean;
}

type DeviceProviderProps ={
    children: ReactNode;
}

export const DeviceContext = createContext({} as DeviceContextData);

function DeviceProvider({children}: DeviceProviderProps){
    const [device, setDevice] = useState<Device>({} as Device);
    const [message, setMessage] = useState('Nothing Yet');
    const [isConnected, setIsConnected] = useState(false);

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
          console.log('scanning');
          // display the Activityindicator
    
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
    
    // handle the device disconnection (poorly)
    async function disconnectDevice() {
    console.log('Disconnecting start');

    if (device != null) {
        const isDeviceConnected = await device.isConnected();
        if (isDeviceConnected) {
        BLTManager.cancelTransaction('messagetransaction');
        BLTManager.cancelTransaction('nightmodetransaction');

        BLTManager.cancelDeviceConnection(device.id).then(() =>
            console.log('DC completed'),
        );
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
        ).then(characteristic => {
            console.log('Boxvalue changed to :', base64.decode(characteristic.value as string));
        });
    }
    //Connect the device and start monitoring characteristics
    async function connectDevice(device: Device) {
        console.log('connecting to Device:', device.name);

        device
            .connect()
            .then(device => {
            setDevice(device);
            setIsConnected(true);
            return device.discoverAllServicesAndCharacteristics();
            })
            .then(device => {
            //  Set what to do when DC is detected
            BLTManager.onDeviceDisconnected(device.id, (error, device) => {
                console.log('Device DC');
                setIsConnected(false);
            });

            //Read inital values

            //Message
            // device
            //   .readCharacteristicForService(SERVICE_UUID, MESSAGE_UUID)
            //   .then(valenc => {
            //     setMessage(base64.decode(valenc?.value as string));
            //   });

            //monitor values and tell what to do when receiving an update

            //Message
            device.monitorCharacteristicForService(
                SERVICE_UUID,
                MESSAGE_UUID,
                (error, characteristic) => {
                if (characteristic?.value != null) {
                    setMessage(base64.decode(characteristic?.value));
                    console.log(
                    'Message update received: ',
                    base64.decode(characteristic?.value),
                    );
                }
                },
                'messagetransaction',
            );
            console.log('Connection established');
        });
    }

    return(
        <DeviceContext.Provider value={{device,isConnected,sendMessage,scanDevices,disconnectDevice}}>
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