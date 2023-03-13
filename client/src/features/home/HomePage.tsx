import { Button } from "@mui/material";
import { useState } from "react";
import FileUpload from "react-mui-fileuploader";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import agent from "../../app/api/agent";

interface Props {
  items: string[];
  names: string[];
}


export default function HomePage({items, names}: Props) {
    const history = useHistory();
    const [filesToUpload, setFilesToUpload] = useState(names || []);
  
    const handleFilesChange = (files: any[]) => {
      // Update chosen files
      setFilesToUpload([...files]);
    };
  
    const uploadFiles = async () => {
      // Create a form and post it to server
      let formData = new FormData();
      filesToUpload.forEach((file) => formData.append("files", file));

        // const uploadDto = agent.File.upload(formData);
        // if (uploadDto.Status) { 
        //     toast.success("File successfully uploaded!");
        // }

        await agent.File.upload(formData)
        .then(() => {
            toast.success('File was uploaded successfully');
            history.push('/quiz');
        })
        .catch(error => handleApiErrors(error))
    };
    return (
        <>
        <FileUpload
          multiFile={true}
          onFilesChange={handleFilesChange}
          onContextReady={(context) => {}}
        />
        <Button onClick={uploadFiles} variant="contained" id="uploadButton">
          Upload
        </Button>
      </>
    )
}

function handleApiErrors(error: any): any {
  throw new Error("Function not implemented.");
}
