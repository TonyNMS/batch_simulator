import React, { useCallback, useState } from "react";
import Dropzone, { useDropzone } from "react-dropzone";

const ModelInputZone =()=>{
    const  [modelName, setModelName] = useState("");
    const onDrop = useCallback(
        (droppedFile)=>{
            const file = droppedFile[0]
            if(droppedFile.length > 0 && file.name.split('.').pop()==='mo'){
                const reader = new FileReader()
                setModelName(file.name)
                reader.onLoad=()=>{
                    const base64File  = btoa(reader.result)
                }
            }else{
                alert ("Make Sure to Drop a .mo file");
            }
        }
    ,[])
    const {getRootProps, getInputProps, isDragActive} = useDropzone(
            {
                onDrop,
                accept:{'application/octet-stream' : ['.mo']},
            }
    );


    return (
        <div className="model-input-dropzone">
            <div {...getRootProps()} className="dropzone">
                <input {...getInputProps()}></input>
                {isDragActive? 
                    <p>Drag and Drop Your File Here</p>:
                    <p>Upload Modelica File : {modelName}</p>
                }
            </div>
        </div>
    )
}
export default ModelInputZone