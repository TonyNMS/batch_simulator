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