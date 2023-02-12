import { Alert, AlertTitle, Button, ButtonGroup, Container, ListItem, ListItemText, Typography } from "@mui/material";
import { useState } from "react";
import agent from "../../app/api/agent";

export default function AboutPage() {
    const [validationErrors, setValidationErrors] = useState<string[]| undefined>();

    function getValidationError(){
        agent.TestErrors.getValidationError()
             .then(() => console.log('should not see this'))
             .catch(error => setValidationErrors(error));
    }
    return (
        <Container>
            <Typography gutterBottom variant="h2">
                About page
            </Typography>
            <ButtonGroup fullWidth>
                <Button variant='contained' onClick={() => agent.TestErrors.get400Error().catch(error => console.log(error))}>Test 400</Button>
                <Button variant='contained' onClick={() => agent.TestErrors.get401Error().catch(error => console.log(error))}>Test 401</Button>
                <Button variant='contained' onClick={() => agent.TestErrors.get404Error().catch(error => console.log(error))}>Test 404</Button>
                <Button variant='contained' onClick={() => agent.TestErrors.get500Error().catch(error => console.log(error))}>Test 500</Button>
                <Button variant='contained' onClick={getValidationError}>Test Validation Error</Button>
            </ButtonGroup>
            {/* { validationErrors.length > 0  && 
                (<Alert severity='error'>
                    <AlertTitle>Validation Errors</AlertTitle>
                    {validationErrors?.map(error=> (
                        <ListItem key={error}>
                            <ListItemText>{error}</ListItemText>
                        </ListItem>
                    ))}
                </Alert>)
            } */}
        </Container>
    )
}