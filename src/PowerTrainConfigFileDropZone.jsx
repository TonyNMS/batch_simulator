import React, { useState } from "react";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import Papa from  "papaparse"
/**
 * Handles Reading CSV
 * Pasring the Component Object 
 * Storeing te Component Object List as Global Context
 * @returns Diesel Engine List, Methanol Engine List, Battery List  
 */

const PowerTrainConfigFileDropZone =()=>{
    const [pwrtrainConfigName, setPwrConfigTrainName] = useState("")
    const [dieselEngineList, setDieselEngineList]  = useState([])
    const [altFuelEngineList, setAltFuelEngineList] = useState([])
    const [batteryList, setBatteryList] = useState([])
    const [pasrsedCSV, setParsedCSV] = useState([])
    const onDrop = useCallback(
        (droppedFile)=>{
            const file = droppedFile[0]
            if(droppedFile.length > 0 && file.name.split('.').pop()==='csv'){
                extractAllEngineModels(file)
                extractAllBattery(file)
            }else{
                alert ("Make Sure to Drop a .csv file");
            }
        }
    ,[])
    const {getRootProps, getInputProps, isDragActive} = useDropzone(
        {
            onDrop,
            accept: {'application/octet-stream':['.csv']}
        }
    )
    const parseRawCSV = (csvFile) => {
        return new Promise((resolve, reject) => {
            Papa.parse(csvFile, {
            header: false,
            skipEmptyLines: "greedy",
            dynamicTyping: false,
            worker: true, 
            complete: ({ data, errors }) => {
                if (errors && errors.length) {
                console.warn("Papa errors:", errors);
                }
                resolve(data);
            },
            error: (err) => {
                reject(err);
            },
            });
        });
    }
    const extractAllEngineModels = async (csvFile)=>{
        /* Prepare Temporary Container  */
        let  temp_die_eng_container = []
        let  temp_alt_eng_container = []
        /* Read CSV */
        const temp_parsed_csv = await parseRawCSV(csvFile)
        /* Extract Engines Objects */
        let engineCounter = 1
        while (temp_parsed_csv[engineCounter][0] !='' &&  temp_parsed_csv[engineCounter][0] != null){
            /*Extract Alt Fuel Engine*/
            if (temp_parsed_csv[engineCounter][6] === "Methanol"){
                const engineObj ={
                    "engine_name" : temp_parsed_csv[engineCounter][0],
                    "engine_p_max": parseInt(temp_parsed_csv[engineCounter][1]),
                    "engine_p_min": parseFloat(temp_parsed_csv[engineCounter][2]),
                    "engine_cost":  parseInt(temp_parsed_csv[engineCounter][3]),
                    "engine_mass":  parseInt(temp_parsed_csv[engineCounter][4]),
                    "engine_volume":parseFloat(temp_parsed_csv[engineCounter][5]),
                    "engine_bsfc" : temp_parsed_csv[engineCounter][7].toString(),
                    "engine_fcc" :  temp_parsed_csv[engineCounter][8].toString(),
                    "engine_fuel_type": "Methanol" 
                }
                temp_alt_eng_container.push(engineObj)
            }
            /*Extract Fuel Engine*/
            if (temp_parsed_csv[engineCounter][6] === "Diesel"){
                const engineObj ={
                    "engine_name" : temp_parsed_csv[engineCounter][0],
                    "engine_p_max": parseInt(temp_parsed_csv[engineCounter][1]),
                    "engine_p_min": parseFloat(temp_parsed_csv[engineCounter][2]),
                    "engine_cost":  parseInt(temp_parsed_csv[engineCounter][3]),
                    "engine_mass":  parseInt(temp_parsed_csv[engineCounter][4]),
                    "engine_volume":parseFloat(temp_parsed_csv[engineCounter][5]),
                    "engine_bsfc" : temp_parsed_csv[engineCounter][7].toString(),
                    "engine_fcc" : temp_parsed_csv[engineCounter][8].toString(),
                    "engine_fuel_type": "Diesel" 
                }
                temp_die_eng_container.push(engineObj)
            }
            engineCounter++ 
        }
        /* Engine Extraction Ends, Set State for Diesel/Methanol Engine Container */
        setDieselEngineList(temp_die_eng_container)
        setAltFuelEngineList(temp_alt_eng_container)
    }
    const extractAllBattery = async (csvFile)=>{
        /*Prepare Battery Containers */
        let temp_battery_container = []
        /*Read the csv */ 
        const temp_parsed_csv = await parseRawCSV(csvFile)
        /*Extract Battery Objects */
        let batteryCounter  = 1 
        while (temp_parsed_csv[batteryCounter][9] != '' &&  temp_parsed_csv[batteryCounter][9] != null ){
            const temp_battery_obj = {
                "battery_name" : temp_parsed_csv[batteryCounter][8],
                "battery_capcity" : parseFloat(temp_parsed_csv[batteryCounter][10]),
                "battery_cost" : parseFloat(temp_parsed_csv[batteryCounter][11]),
                "battery_mass" : parseFloat (temp_parsed_csv[batteryCounter][12]),
                "battery_volume" : parseFloat(temp_parsed_csv[batteryCounter][13]),
                "battery_voltage" : parseFloat(temp_parsed_csv[batteryCounter][14]),
                "battery_current": parseFloat(temp_parsed_csv[batteryCounter][15]),
                "battery_max_c_rate":parseFloat (temp_parsed_csv[batteryCounter][16]),
                "battery_charge_rate": parseFloat(temp_parsed_csv[batteryCounter][17]) * parseFloat(temp_parsed_csv[batteryCounter][17])
            }
            temp_battery_container.push(temp_battery_obj)
            batteryCounter++
        }
        /*Send the container to update the state */
        setBatteryList(temp_battery_container)
    }
    return (
        <div className="power-train-config-file-dropzone-container">
            <div {...getRootProps()} className="dropzone">
                <input {...getInputProps()}></input>
                {isDragActive? 
                    <p>Drag and Drop Your Duty Cycle File Here</p>:
                    <p>Upload Power Unit Component List : {"Things"}</p>
                }
            </div>
        </div>
    )
}
export default PowerTrainConfigFileDropZone