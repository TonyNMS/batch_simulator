import React, { useContext, useState } from "react";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import Papa from  "papaparse"
import {BatteryObjectListContext, AltFuelEngineContext, DieselEngineContext} from "./App.jsx"
/**
 * Handles Reading CSV
 * Pasring the Component Object 
 * Storeing te Component Object List as Global Context
 * returns Diesel Engine List, Methanol Engine List, Battery List  
 */

const PowerTrainConfigFileDropZone =()=>{
    const [pwrtrainConfigName, setPwrConfigTrainName] = useState("")
    const [dieselEngineList, setDieselEngineList]  = useState([])  
    const [altFuelEngineList, setAltFuelEngineList] = useState([])
    const [batteryList, setBatteryList] = useState([])
    const [pasrsedCSV, setParsedCSV] = useState([])
    const [BatteryContext, setBatteryListContext] = useContext(BatteryObjectListContext)
    const [AltFuelGenContex, setAltFuelGenContext] = useContext(AltFuelEngineContext)
    const [DieselGenContext, setDieselGenContext] = useContext(DieselEngineContext)
    
    const onDrop = useCallback(
        async (droppedFile)=>{
            const file = droppedFile[0]
            if(droppedFile.length > 0 && file.name.split('.').pop()==='csv'){
                const rows = await parseRawCSV(file); // 2D array
                await extractAllEngineModelsFromRows(rows);
                await extractAllBatteriesFromRows(rows);
            }else{
                alert ("Make Sure to Drop a .csv file");
            }
        }
    ,[])
    const {getRootProps, getInputProps, isDragActive} = useDropzone(
        {
            onDrop,
            accept: {"text/csv":['.csv']}
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
    const extractAllEngineModelsFromRows = async (rows) => {
        const temp_die_eng_container = [];
        const temp_alt_eng_container = [];

        // start at 1 if row 0 is header
        let i = 1;

        // ✅ Only bound check in the while condition
        while (i < rows.length) {
            const row = rows[i];
            // skip missing/empty rows
            if (!row || row.length === 0) { i++; continue; }

            // safely read columns
            const name  = row[0]?.trim();
            const fuel  = row[6]?.trim();

            // if there is no engine name, you can either break (if engines end here)
            // or continue (if your file might have blanks in between)
            if (!name) { i++; continue; }

            if (fuel === "Diesel" || fuel === "Methanol") {
            const engineObj = {
                engine_name: name,
                engine_p_max: Number(row[1]),
                engine_p_min: Number(row[2]),
                engine_cost: Number(row[3]),
                engine_mass: Number(row[4]),
                engine_volume: Number(row[5]),
                engine_bsfc: row[7]?.toString() ?? "",
                engine_fcc:  row[8]?.toString() ?? "",
                engine_fuel_type: fuel
            };
            if (fuel === "Diesel")   temp_die_eng_container.push(engineObj);
            if (fuel === "Methanol") temp_alt_eng_container.push(engineObj);
            }

            i++;
        }

        setDieselEngineList(temp_die_eng_container);
        setAltFuelEngineList(temp_alt_eng_container);
        setDieselGenContext(temp_die_eng_container);
        setAltFuelGenContext(temp_alt_eng_container);
    };

    const extractAllBatteriesFromRows = async (rows) => {
        const temp_battery_container = [];
        // optional: dedupe by name
        const seen = new Set();

        let i = 1; // skip header if present
        while (i < rows.length) {
            const row = rows[i];
            if (!row || row.length === 0) { i++; continue; }

            const name     = row[9]?.trim();  // Battery_Name
            if (!name) { i++; continue; }     // just skip rows with no battery

            const cap      = Number(row[10]); // Battery_Capacity
            const cost     = Number(row[11]);
            const mass     = Number(row[12]);
            const volume   = Number(row[13]);
            const voltage  = Number(row[14]);
            const current  = Number(row[15]);
            const cRate    = Number(row[16]);

            if (!seen.has(name)) {
            temp_battery_container.push({
                battery_name: name,
                battery_capcity: cap,
                battery_cost: cost,
                battery_mass: mass,
                battery_volume: volume,
                battery_voltage: voltage,
                battery_current: current,
                battery_max_c_rate: cRate,
                battery_charge_rate: cRate * current,
                battery_max_charge_power: voltage * current,
            });
            seen.add(name);
            }

            i++;
        }
        console.log(temp_battery_container)
        setBatteryList(temp_battery_container);
        setBatteryListContext(temp_battery_container);
    };

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