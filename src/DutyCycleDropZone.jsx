import React, { useState, useCallback }  from "react"
import Dropzone, { useDropzone } from "react-dropzone";
import Pap from "papaparse"
/**
 * 
 * @returns Parsed Duty Cycle String, Max Power Demand 
 */
const  DutyCycleDropZone =()=>{
    const  [dutyCycleName, setDutyCycleName] = useState("");
    const onDrop = useCallback(
        (droppedFile)=>{
            const file = droppedFile[0]
            if(droppedFile.length > 0 && file.name.split('.').pop()==='csv'){
                prepareDutyCycle(file)
            }else{
                alert ("Make Sure to Drop a .mo file");
            }
        }
    ,[])
    const {getRootProps, getInputProps, isDragActive} = useDropzone(
            {
                onDrop,
                accept:{'application/octet-stream' : ['.csv']},
            }
    );
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
    const prepareDutyCycle = async (csvFile)=>{
        /*Parse the CSV*/
        const temp_dutyCycle = parseRawCSV(csvFile)
        /*Find the Max Power Demand duty the DUty Cycle*/
        const colValues = temp_dutyCycle
            .slice(1)                     
            .map(row => row[1])           
            .filter(v => v !== "" && v != null)  
            .map(Number);                

        const maxPower = Math.max(...colValues);
        /*Update the gloabl context*/
        
    }


    return (
        <div className="model-input-dropzone">
            <div {...getRootProps()} className="dropzone">
                <input {...getInputProps()}></input>
                {isDragActive? 
                    <p>Drag and Drop Your Duty Cycle File Here</p>:
                    <p>Upload Duty Cycle  File : {dutyCycleName}</p>
                }
            </div>
        </div>
    )
    
}
export default  DutyCycleDropZone