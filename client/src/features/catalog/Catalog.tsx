import { Grid, Paper } from "@mui/material";
import { useEffect } from "react";
import AppPagination from "../../app/components/AppPagination";
import CheckboxButtons from "../../app/components/CheckboxButtons";
import LoadingComponent from "../../app/layout/LoadingComponent";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { fetchFilters, fetchEmployeesAsync, employeeSelectors, setPageNumber, setEmployeeParams } from "./catalogSlice";
import EmployeeList from "./EmployeeList";
import EmployeeSearch from "./EmployeeSearch";

const sortOptions = [
    { value: 'name', label: 'Alphabetical' },
    { value: 'priceDesc', label: 'Price - High to low' },
    { value: 'price', label: 'Price - Low to high' },
]

export default function Catalog() {
    const products = useAppSelector(employeeSelectors.selectAll);
    const { employeesLoaded, filtersLoaded, skills, jobs, employeeParams, metaData } = useAppSelector(state => state.catalog);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (!employeesLoaded) dispatch(fetchEmployeesAsync());
    }, [employeesLoaded, dispatch])

    useEffect(() => {
        if (!filtersLoaded) dispatch(fetchFilters());
    }, [filtersLoaded, dispatch]);

    if (!filtersLoaded) return <LoadingComponent message='Loading employees...' />

    return (
        <Grid container columnSpacing={4}>
            <Grid item xs={3}>
                <Paper sx={{ mb: 2 }}>
                    <EmployeeSearch />
                </Paper>
                <Paper sx={{ mb: 2, p: 2 }}>
                    <CheckboxButtons
                        items={skills}
                        checked={employeeParams.skills}
                        onChange={(checkedItems: string[]) => dispatch(setEmployeeParams({ skills: checkedItems }))}
                    />
                </Paper>
                <Paper sx={{ p: 2 }}>
                    <CheckboxButtons
                        items={jobs}
                        checked={employeeParams.jobs}
                        onChange={(checkedItems: string[]) => dispatch(setEmployeeParams({ jobs: checkedItems }))}
                    />
                </Paper>
            </Grid>
            <Grid item xs={9}>
                <EmployeeList employees={products} />
            </Grid>
            <Grid item xs={3} />
            <Grid item xs={9} sx={{mb: 2}}>
                {metaData &&
                <AppPagination 
                    metaData={metaData}
                    onPageChange={(page: number) => dispatch(setPageNumber({pageNumber: page}))}
                />}
            </Grid>
        </Grid>
    )
}