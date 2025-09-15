import { useState, createContext } from 'react'
import './App.css'
import ModelInputZone from './ModelInputZone'
import DutyCycleDropZone from './DutyCycleDropZone'
import PowerTrainConfigFileDropZone from './PowerTrainConfigFileDropZone'
import UtilityContainer from './UtilityContainer'

export const BatteryObjectListContext  = createContext()
export const AltFuelEngineContext = createContext()
export const DieselEngineContext =  createContext()
export const DutyCycleContext  = createContext()
export const MaxPowerDemandContext = createContext()
export const SimulationResultContext = createContext()
export const SimulationStartEndTime = createContext()

function App() {
  const [batteryObjectList, setBatteryObjList] = useState([])
  const [dieselGenList, setDieselGenList] = useState([])
  const [altFuelGenList, setAltFuelGenList] = useState([])
  const [dutyCycleContext , setDutyCycleContext] = useState([])
  const [maxPowerDemandContext, setMaxPowerDemandContext] = useState(0)
  const [startEndTime, setStartEndTime] = useState()
  const [resultGross, setResultGross] = useState([])
  return (
    <div>
      <BatteryObjectListContext.Provider value={[batteryObjectList, setBatteryObjList]}>
        <AltFuelEngineContext.Provider value ={[altFuelGenList, setAltFuelGenList]}>
          <DieselEngineContext.Provider value = {[dieselGenList, setDieselGenList]}>
            <DutyCycleContext.Provider value = {[dutyCycleContext, setDutyCycleContext]}>
             <MaxPowerDemandContext.Provider value = {[maxPowerDemandContext, setMaxPowerDemandContext]}>
              <SimulationResultContext.Provider value = {[resultGross, setResultGross]}>
                <SimulationStartEndTime.Provider value = {[startEndTime, setStartEndTime]}>
                    <ModelInputZone></ModelInputZone>
                    <DutyCycleDropZone></DutyCycleDropZone>
                    <PowerTrainConfigFileDropZone></PowerTrainConfigFileDropZone>
                    <UtilityContainer></UtilityContainer>
                </SimulationStartEndTime.Provider>
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
