import { Button } from "@mui/material";
import { useState } from "react";
import FileUpload from "react-mui-fileuploader";
import agent from "../../app/api/agent";

interface Props {
  items: string[];
  names: string[];
}


export default function HomePage({items, names}: Props) {
    const [filesToUpload, setFilesToUpload] = useState(names || []);
  
    const handleFilesChange = (files: any[]) => {
      // Update chosen files
      setFilesToUpload([...files]);
    };
  
    const uploadFiles = async () => {
      // Create a form and post it to server
      let formData = new FormData();
      filesToUpload.forEach((file) => formData.append("files", file));
      

      // fetch("/file/upload", {
      //   method: "POST",
      //   body: formData
      // });

      const result = agent.File.upload(formData);
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