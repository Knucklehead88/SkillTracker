import { Button } from "@mui/material";
import { useState } from "react";
import FileUpload from "react-mui-fileuploader";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import agent from "../../app/api/agent";
import LoadingComponent from "../../app/layout/LoadingComponent";

interface Props {
  names: string[];
}


export default function HomePage({names}: Props) {
    const history = useHistory();
    const [filesToUpload, setFilesToUpload] = useState(names || []);
    const [loading, setLoading] = useState(false);
  
    const handleFilesChange = (files: any[]) => {
      // Update chosen files
      setFilesToUpload([...files]);
    };

    if (loading) return <LoadingComponent message='Uploading questions...' />
  
    const uploadFiles = async () => {
      // Create a form and post it to server
      let formData = new FormData();
      filesToUpload.forEach((file) => formData.append("files", file));

      setLoading(true);
      await agent.File.upload(formData)
        .then(() => {
            toast.success('File uploaded successfully!');
            history.push('/quiz');
        })
        .catch(error => handleApiErrors(error))
        .finally(() => setLoading(false));
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
