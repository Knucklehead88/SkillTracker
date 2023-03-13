import { Grid } from "@mui/material";
import { Employee } from "../../app/models/employee";
import { useAppSelector } from "../../app/store/configureStore";
import EmployeeCard from "./EmployeeCard";
import EmployeeCardSkeleton from "./EmployeeCardSkeleton";

interface Props {
    employees: Employee[];
}

export default function EmployeeList({employees}:Props){
    const { employeesLoaded } = useAppSelector(state => state.catalog);
    return (
        <Grid container spacing={4}>
        {employees.map(employee => (
            <Grid item xs={4} key={employee.id}>
                {!employeesLoaded ? (
                    <EmployeeCardSkeleton />
                ) : (
                    <EmployeeCard product={employee} />
                )}
            </Grid>
        ))}

        </Grid>
    )
}