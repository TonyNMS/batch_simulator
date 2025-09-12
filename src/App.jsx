import { useState, createContext } from 'react'
import './App.css'
import ModelInputZone from './ModelInputZone'
import DutyCycleDropZone from './DutyCycleDropZone'
import PowerTrainConfigFileDropZone from './PowerTrainConfigFileDropZone'

export const BatteryObjectListContext  = createContext()
export const AltFuelEngineContext = createContext()
export const DieselEngineContext =  createContext()
export const DutyCycleContext  = createContext()
export const MaxPowerDemandContext = createContext()
export const SimulationResultContext = createContext()


function App() {
  const [batteryObjectList, setBatteryObjList] = useState([])
  const [dieselGenList, setDieselGenList] = useState([])
  const [altFuelGenList, setAltFuelGenList] = useState([])
  const [dutyCycleContext , setDutyCycleContext] = useState([])
  const [maxPowerDemandContext, setMaxPowerDemandContext] = useState(0)
  return (
    <div>
      <BatteryObjectListContext.Provider value={[batteryObjectList, setBatteryObjList]}>
        <AltFuelEngineContext.Provider value ={[dieselGenList, setDieselGenList]}>
          <DieselEngineContext.Provider value = {[altFuelGenList, setAltFuelGenList]}>
            <DutyCycleContext.Provider value = {[dutyCycleContext, setDutyCycleContext]}>
             <MaxPowerDemandContext.Provider value = {[maxPowerDemandContext, setMaxPowerDemandContext]}>
              <SimulationResultContext.Provider>
                    <ModelInputZone></ModelInputZone>
                    <DutyCycleDropZone></DutyCycleDropZone>
                    <PowerTrainConfigFileDropZone></PowerTrainConfigFileDropZone>
              </SimulationResultContext.Provider>
             </MaxPowerDemandContext.Provider>
            </DutyCycleContext.Provider>
          </DieselEngineContext.Provider>
        </AltFuelEngineContext.Provider>
      </BatteryObjectListContext.Provider>
    </div>
  )
}

export default App
