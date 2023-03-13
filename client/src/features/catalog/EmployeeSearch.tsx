import { debounce, TextField } from "@mui/material";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { setEmployeeParams } from "./catalogSlice";

export default function EmployeeSearch() {
    const {employeeParams} = useAppSelector(state => state.catalog);
    const [searchTerm, setSearchTerm] = useState(employeeParams.searchTerm);
    const dispatch = useAppDispatch();

    const debouncedSearch = debounce((event: any) => {
        dispatch(setEmployeeParams({searchTerm: event.target.value}))
    }, 1000)

    return (
        <TextField
            label='Search employees'
            variant='outlined'
            fullWidth
            value={searchTerm || ''}
            onChange={(event: any) => {
                setSearchTerm(event.target.value);
                debouncedSearch(event);
            }}
        />
    )
} 