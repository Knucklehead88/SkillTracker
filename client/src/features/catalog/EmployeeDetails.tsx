import { LoadingButton } from "@mui/lab";
import { Divider, Grid, Table, TableBody, TableCell, TableContainer, TableRow, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import NotFound from "../../app/errors/NotFound";
import LoadingComponent from "../../app/layout/LoadingComponent";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { addBasketItemAsync, removeBasketItemAsync  } from "../basket/basketSlice";
import { fetchEmployeeAsync, employeeSelectors } from "./catalogSlice";

export default function EmployeeDetails() {
    const {basket, status} = useAppSelector(state => state.basket);
    const dispatch = useAppDispatch();
    const {id} = useParams<{id: string}>();
    const employee = useAppSelector(state => employeeSelectors.selectById(state, id));
    const {status: productStatus} = useAppSelector(state => state.catalog);
    const [quantity, setQuantity] = useState(0);
    const item = basket?.items.find(i => i.productId === employee?.id);

    useEffect(() => {
        if (!employee) dispatch(fetchEmployeeAsync(parseInt(id)))
    }, [id, dispatch, employee]);

    function handleInputChange(event: any) {
        if (event.target.value > 0) {
            setQuantity(parseInt(event.target.value));
        }
    }


    if (productStatus.includes('pending')) return <LoadingComponent message="Loading employee..." />

    if (!employee) return <NotFound />

    return (
        <Grid container spacing={6}>
            <Grid item xs={6}>
                {/* <img src={product.pictureUrl} alt={product.name} style={{width: '100%'}} /> */}
            </Grid>
            <Grid item xs={6}>
                <Typography variant='h3'>{employee.userName}</Typography>
                <Divider sx={{mb: 2}} />
                <Typography variant='h4' color='secondary'>{employee.id}</Typography>
                <TableContainer>
                    <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell>Username</TableCell>
                                <TableCell>{employee.userName}</TableCell>
                            </TableRow>    
                            <TableRow>
                                <TableCell>Email</TableCell>
                                <TableCell>{employee.email}</TableCell>
                            </TableRow>  
                            <TableRow>
                                <TableCell>Job</TableCell>
                                <TableCell>{employee.job}</TableCell>
                            </TableRow>  
                            <TableRow>
                                <TableCell>Skill</TableCell>
                                <TableCell>{employee.skill}</TableCell>
                            </TableRow>   
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>
        </Grid>
    )
}