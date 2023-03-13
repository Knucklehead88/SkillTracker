import { Box, Button, Container, CssBaseline, Divider, Paper, Typography } from "@mui/material";
import { Link } from "react-router-dom";

export default function NotFound() {
    return (
    <>
        <CssBaseline />
        <Container maxWidth="sm" component={Paper} sx={{height: 100}}>
            <Typography gutterBottom variant="h5">Oops - we could not find what you are looking for</Typography>
            <Divider />
            <Button fullWidth component={Link} to='/'>Go back to HomePage</Button>
        </Container>
    </>
    )
}