import React, {useContext} from "react";
import { BatteryObjectListContext, AltFuelEngineContext, DieselEngineContext} from "./App";
import axios from "axios";
const  POSSIBLE_DIESEL_GEN_COUNT = [1,2,3]
const  POSSIBLE_ALT_FUEL_GEN_COUNT = [0,1, 2 ,3]
const  POSSIBLE_BATTERY_COUNT = [0, 1,2,3,4]

const UtilityContainer =()=>{

    const [BatteryContext, setBatteryListContext] = useContext(BatteryObjectListContext)
    const [AltFuelGenContex, setAltFuelGenContext] = useContext(AltFuelEngineContext)
    const [DieselGenContext, setDieselGenContext] = useContext(DieselEngineContext)
    const [AllCombinations, setAllCombinations] = useState()
    function cartesianProduct(arrays) {
        return arrays.reduce(
            (acc, curr) => acc.flatMap(a => curr.map(b => [...a, b])),
            [[]]
        )
    }
    function buildCombinations(dieselEngines, methEngines, batteries) {
        const dieselChoices   = dieselEngines.flatMap(d => dieselCounts.map(c => ({ diesel: d, dieselCount: c })));
        const methanolChoices = methEngines.flatMap(m => methanolCounts.map(c => ({ meth: m, methCount: c })));
        const batteryChoices  = batteries.flatMap(b => batteryCounts.map(c => ({ battery: b, batteryCount: c })));

        // Cartesian product across the 3 categories
        const combos = cartesianProduct([dieselChoices, methanolChoices, batteryChoices]);

        // Reformat into your desired shape
        return combos.map(([d, m, b]) => ({
            Diesel_Engine: d.diesel,
            Diesel_Engine_Count: d.dieselCount,
            Meth_Engine: m.meth,
            Meth_Count: m.methCount,
            Battery: b.battery,
            Battery_Count: b.batteryCount,
        }))
    }


    
    const loadModel = () =>{
        let modelName
        return modelName
    }

    const simulateOnce =()=>{
        const modelName  = loadModel();
        axios.post('http://127.0.0.1:5000/model.delete',{
            model_name : modelName
        }).then(
            response=>{
                let temp = response.data.status

            }
        )


    }

    const simulateLoop =()=>{

    }
    const formAllPossiblePwrTrainConfig =()=>{

    }
    const calcualteViableNumberOfDieGen =()=>{

    }
    const calculateViableNumbeOfMethGen =()=>{

    }
    const calculateViableNumberOfBatteris =()=>{
        
    } 
    return (
        <div className = 'utility-container'>
            <div> 
                <button>Simulate Once</button>
            </div>
            <div>
                <button>Simulation Loop</button>
            </div>
        </div>
    )
}   
export default UtilityContainer