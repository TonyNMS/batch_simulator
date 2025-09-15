import React, {useContext, useState} from "react";
import { BatteryObjectListContext, AltFuelEngineContext, DieselEngineContext, SimulationResultContext} from "./App";
import axios from "axios";
import modelUrl from "./model_asset/AZEAT_Validation.mo?url";
const  POSSIBLE_DIESEL_GEN_COUNT = [1,2,3]
const  POSSIBLE_ALT_FUEL_GEN_COUNT = [0,1,2,3]
const  POSSIBLE_BATTERY_COUNT = [0, 1,2,3,4]
/**
 * Contains UI for Commiting Simulation
 * Accepets Arries of Battery / Diesel Gen /  Methanol Gen 
 * returns 
 */

const UtilityContainer =()=>{

    const [BatteryContext, setBatteryListContext] = useContext(BatteryObjectListContext)
    const [AltFuelGenContex, setAltFuelGenContext] = useContext(AltFuelEngineContext)
    const [DieselGenContext, setDieselGenContext] = useContext(DieselEngineContext)
    const [SImResultContext, setSimResultContext] = useContext(SimulationResultContext)
    const [AllCombinations, setAllCombinations] = useState()
    const [taskProgress, setTaskprogress] = useState("Idle")
    function cartesianProduct(arrays) {
        /**
         * Takes an array of flattend (Diesel Engine / Count)(AltGen / Count)(Battery /Count) sub arries 
         * @returns Flattened array of all possible combination 
         */
        return arrays.reduce(
            (acc, curr) => acc.flatMap(a => curr.map(b => [...a, b])),
            [[]]
        )
    }
    async function buildCombinations(dieselEngines, methEngines, batteries) {
        /**
         * Takes In list of Battery, AltFuel, Diesel Engines
         * return List of all possile combination
         */
        const dieselChoices   = dieselEngines.flatMap(d => POSSIBLE_DIESEL_GEN_COUNT.map(c => ({ diesel: d, dieselCount: c })));
        const methanolChoices = methEngines.flatMap(m => POSSIBLE_ALT_FUEL_GEN_COUNT.map(c => ({ meth: m, methCount: c })));
        const batteryChoices  = batteries.flatMap(b => POSSIBLE_BATTERY_COUNT.map(c => ({ battery: b, batteryCount: c })));

        const combos = cartesianProduct([dieselChoices, methanolChoices, batteryChoices]);
        
        return combos.map(([d, m, b]) => ({
            Diesel_Engine: d.diesel,
            Diesel_Engine_Count: d.dieselCount,
            Meth_Engine: m.meth,
            Meth_Count: m.methCount,
            Battery: b.battery,
            Battery_Count: b.batteryCount,
        }))
    }
    async function modelicaparameterMapping(combinationInstance){
        /**
         * Map The Generated Combination to Modelica File
         * Return the a generated collection of changed parameters 
         */
        const changed_params = combinationInstance.map((instance)=>{
            let temp_changed_parameter = {
                instance : instance,
                changed_parameters:[]
            }
            //Diesel Generatorts Related Parameters
            temp_changed_parameter.changed_parameters.push({param:"generator_P_rat", value:(instance.Diesel_Engine.engine_p_max) * 1000})
            temp_changed_parameter.changed_parameters.push({param:"generator_P_idle", value:(instance.Diesel_Engine.engine_p_min) * 1000})
            if (instance.Diesel_Engine_Count == 3){
                temp_changed_parameter.changed_parameters.push({param:"N_diesel_gen_onboard", value : 3})
                temp_changed_parameter.changed_parameters.push({param:"diesel_gen1_is_on", value : true})
                temp_changed_parameter.changed_parameters.push({param:"diesel_gen2_is_on", value : true})
                temp_changed_parameter.changed_parameters.push({param:"diesel_gen3_is_on", value : true})
            }else if(instance.Diesel_Engine_Count == 2){
                temp_changed_parameter.changed_parameters.push({param:"N_diesel_gen_onboard", value : 2})
                temp_changed_parameter.changed_parameters.push({param:"diesel_gen1_is_on", value : true})
                temp_changed_parameter.changed_parameters.push({param:"diesel_gen2_is_on", value : true})
                temp_changed_parameter.changed_parameters.push({param:"diesel_gen3_is_on", value : false})
            }else{
                temp_changed_parameter.changed_parameters.push({param:"N_diesel_gen_onboard", value : 1})
                temp_changed_parameter.changed_parameters.push({param:"diesel_gen1_is_on", value : true})
                temp_changed_parameter.changed_parameters.push({param:"diesel_gen2_is_on", value : false})
                temp_changed_parameter.changed_parameters.push({param:"diesel_gen3_is_on", value : false})
            }
            //Alt Fuel Engine Rated Parameters
            temp_changed_parameter.changed_parameters.push({param:"generator_alt_P_rat", value:(instance.Meth_Engine.engine_p_max)*1000})
            temp_changed_parameter.changed_parameters.push({param:"generator_alt_P_idle", value:(instance.Diesel_Engine.engine_p_min)*1000})
            if (instance.Meth_Count == 3){
                temp_changed_parameter.changed_parameters.push({param:"N_alt_fuel_gen_onboard", value : 3})
                temp_changed_parameter.changed_parameters.push({param:"altFuel_gen1_is_on", value : true})
                temp_changed_parameter.changed_parameters.push({param:"altFuel_gen2_is_on", value : true})
                temp_changed_parameter.changed_parameters.push({param:"altFuel_gen3_is_on", value : true})
            }else if(instance.Meth_Count == 2){
                temp_changed_parameter.changed_parameters.push({param:"N_alt_fuel_gen_onboard", value : 2})
                temp_changed_parameter.changed_parameters.push({param:"altFuel_gen1_is_on", value : true})
                temp_changed_parameter.changed_parameters.push({param:"altFuel_gen2_is_on", value : true})
                temp_changed_parameter.changed_parameters.push({param:"altFuel_gen3_is_on", value : false})
            }else if(instance.Meth_Count == 1){
                temp_changed_parameter.changed_parameters.push({param:"N_alt_fuel_gen_onboard", value : 1})
                temp_changed_parameter.changed_parameters.push({param:"altFuel_gen1_is_on", value : true})
                temp_changed_parameter.changed_parameters.push({param:"altFuel_gen2_is_on", value : false})
                temp_changed_parameter.changed_parameters.push({param:"altFuel_gen3_is_on", value : false})
            }else{
                temp_changed_parameter.changed_parameters.push({param:"N_alt_fuel_gen_onboard", value : 0})
                temp_changed_parameter.changed_parameters.push({param:"altFuel_gen1_is_on", value : false})
                temp_changed_parameter.changed_parameters.push({param:"altFuel_gen2_is_on", value : false})
                temp_changed_parameter.changed_parameters.push({param:"altFuel_gen3_is_on", value : false})
            }
            // Battery Related Parameteres
            if (instance.Battery_Count == 4){
                temp_changed_parameter.changed_parameters.push({param:"battery_Capacity", value : (instance.Battery.battery_capcity) * 3.6e+6 * 4})
                temp_changed_parameter.changed_parameters.push({param:"battery_P_max", value : (instance.Battery.battery_max_charge_power) * 4})
            }else if (instance.Battery_Count == 3){
                temp_changed_parameter.changed_parameters.push({param:"battery_Capacity", value : (instance.Battery.battery_capcity) * 3.6e+6 * 3})
                temp_changed_parameter.changed_parameters.push({param:"battery_P_max", value : (instance.Battery.battery_max_charge_power) * 3})
            }else if(instance.Battery_Count == 2){
                temp_changed_parameter.changed_parameters.push({param:"battery_Capacity", value : (instance.Battery.battery_capcity) * 3.6e+6 * 2})
                temp_changed_parameter.changed_parameters.push({param:"battery_P_max", value : (instance.Battery.battery_max_charge_power) * 2})
            }else if(instance.Battery_Count == 1){
                temp_changed_parameter.changed_parameters.push({param:"battery_Capacity", value : (instance.Battery.battery_capcity) * 3.6e+6 * 1})
                temp_changed_parameter.changed_parameters.push({param:"battery_P_max", value : (instance.Battery.battery_max_charge_power) * 1})
            }else{
                temp_changed_parameter.changed_parameters.push({param:"battery_Capacity", value : (instance.Battery.battery_capcity) * 3.6e+6 * 1})
                temp_changed_parameter.changed_parameters.push({param:"battery_P_max", value : 0.1})
            }
            return temp_changed_parameter

        })
        return changed_params
    }
   
    async function loadModel() {
        let modelName  
        try {
            // Fetch the Modelica file as text
            const res = await fetch(modelUrl);
            const text = await res.text();
            const filePath = modelUrl
            const modelBase64File = btoa(text);
            const fileName = filePath.split("/").pop();

            modelName = fileName.replace(/\.[^/.]+$/, ""); 
            // Upload to backend
            const response = await axios.post("http://127.0.0.1:5000/model/upload", {
                model_name: modelName,
                model_data: modelBase64File,
            });
            console.log("Uploading")
            if (response.data.status === "Model written") {
                console.log("Loading successful");
            } else {
                console.log("Model Not Written");
                alert("Model Not Written");
            }
        } catch (error) {
                console.error("Error uploading file:", error);
                alert("Model Uploading Failed");
        }

        return modelName.trim()
    }

    async function simulateOnce(){
       /**
        * Call LoadModle(), aquire the retunred model name
        * Call Simulate endpoint
        * Return a colelction of simulation results 
        */
        let temp_result_collection = [] 
        const modelName  = await loadModel();
        if (modelName  == '' || modelName == null){
            alert ("Simulation Cann ot Proceed, Model Name can not be resolved")
            return 
        }else{
            axios.post('http://127.0.0.1:5000/model/simulate',{
                model_name : modelName,
                start_time  : 0,
                stop_time: 652860,
                overrides:[
                    {param : "N_diesel_gen_onboard", value : 1},
                    {param : "generator_P_rat", value : 900000},
                    {param : "diesel_gen2_is_on", value : false}
                ] 
            }).then(response=>{
                    temp_result_collection.push(
                        {simulation_name: "", res: response.data.result}
                    )
                    console.log (response.data.result)
                    console.log("simulation successful");
            }).catch(error  =>{
                        console.log('Error During Simulation:', error);
                        alert(`Simualtion Failed, Check the following error, ${error}`)
                    }
            )
        }

    }

    const  handleSimulationLoop =async ()=>{
        /**
         * Begine With Forming All Possible Combination, return if the Batt or MEth or Die arries is empty 
         * Read All arries returned from  
         *      @buildCombinations returns the a list of all possible combination
         *      @modelicaparameterMapping use the list list all possible combination to form the modelcia parameter object
         *      collect the result.
         * Return  Result of Batch SImulations 
         */
        let temp_result_collection = []
        if (DieselGenContext.length===0  || AltFuelGenContex.length===0 || BatteryContext === 0){
            alert ("No Component Can be Found")
            return 
        }
        const possible_combinations =  await buildCombinations(DieselGenContext, AltFuelGenContex, BatteryContext)
        const list_of_config_combinations = await modelicaparameterMapping(possible_combinations)
        const modelName  = await loadModel();
        
        for (const config of list_of_config_combinations) {
            const simName = `${config.instance.Diesel_Engine_Count}× ${config.instance.Diesel_Engine.engine_name} + ` +
                            `${config.instance.Meth_Count}× ${config.instance.Meth_Engine.engine_name} + ` +
                            `${config.instance.Battery_Count}× ${config.instance.Battery.battery_name}`;
            try {
                const { data } = await axios.post("http://127.0.0.1:5000/model/simulate", {
                    model_name: modelName,      
                    start_time: 0,
                    stop_time: 652860,
                    overrides:  config.changed_parameters
                });
                temp_result_collection.push({ sim_name: simName, res: data.result });
                console.log("OK:", simName);
            } catch (e) {
                console.error("Simulation failed:", simName, e);
                temp_result_collection.push({ sim_name: simName, error: String(e) });
            
            }
        }
    }
    return (
        <div className = 'utility-container'>
            <div> 
                <button onClick = {simulateOnce}>Simulate Once </button>
            </div>
            <div>
                <button onClick = {handleSimulationLoop}>Batch Simulation Type JS </button>
                <button>Batch Simulation Type Py</button>
            </div>
        </div>
    )
}   
export default UtilityContainer