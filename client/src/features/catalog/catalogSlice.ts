import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import agent from "../../app/api/agent";
import { Employee, EmployeeParams } from "../../app/models/employee";
import { MetaData } from "../../app/models/pagination";
import { RootState } from "../../app/store/configureStore";

interface CatalogState {
    employeesLoaded: boolean;
    filtersLoaded: boolean;
    status: string;
    skills: string[];
    jobs: string[];
    employeeParams: EmployeeParams;
    metaData: MetaData | null;
}

const employeesAdapter = createEntityAdapter<Employee>();


function getAxiosParams(employeeParams: EmployeeParams) {
    const params = new URLSearchParams();
    params.append('pageNumber', employeeParams.pageNumber.toString());
    params.append('pageSize', employeeParams.pageSize.toString());
    params.append('orderBy', employeeParams.orderBy);
    if (employeeParams.searchTerm) params.append('searchTerm', employeeParams.searchTerm);
    if (employeeParams.skills.length > 0) params.append('skills', employeeParams.skills.toString());
    if (employeeParams.jobs.length > 0) params.append('jobs', employeeParams.jobs.toString());
    return params;
}

export const fetchEmployeesAsync = createAsyncThunk<Employee[], void, {state: RootState}>(    
    'employees/fetchEmployeesAsync',
    async (_, thunkAPI) => {
        const params = getAxiosParams(thunkAPI.getState().catalog.employeeParams);
        try {
            const response = await agent.Employees.list(params);
            thunkAPI.dispatch(setMetaData(response.metaData));
            return response.items;
        } catch (error: any) {
            return thunkAPI.rejectWithValue({error: error.data})
        }
    }
)

export const fetchEmployeeAsync = createAsyncThunk<Employee, number>(
    'employees/fetchEmployeeAsync',
    async (employeeId, thunkAPI) => {
        try {
            return await agent.Employees.details(employeeId);
        } catch (error: any) {
            return thunkAPI.rejectWithValue({error: error.data})
        }
    }
)

export const fetchFilters = createAsyncThunk(
    'catalog/fetchFilters',
    async (_, thunkAPI) => {
        try {
            return agent.Employees.fetchFilters();
        } catch (error: any) {
            return thunkAPI.rejectWithValue({error: error.data})
        }
    }
)

function initParams() {
    return {
        pageNumber: 1,
        pageSize: 6,
        orderBy: 'name',
        skills: [],
        jobs: []
    }
}

export const catalogSlice = createSlice({
    name: 'employees',
    initialState: employeesAdapter.getInitialState<CatalogState>({
        employeesLoaded: false,
        filtersLoaded: false,
        status: 'idle',
        skills: [],
        jobs: [],
        employeeParams: initParams(),
        metaData: null
    }),
    reducers: {
        setEmployeeParams: (state, action) => {
            state.employeesLoaded = false;
            state.employeeParams = {...state.employeeParams, ...action.payload, pageNumber: 1};
        },
        setPageNumber: (state, action) => {
            state.employeesLoaded = false;
            state.employeeParams = {...state.employeeParams, ...action.payload};
        },
        setMetaData: (state, action) => {
            state.metaData = action.payload;
        },
        resetEmployeeParams: (state) => {
            state.employeeParams = initParams();
        }
    },
    extraReducers: (builder => {
        builder.addCase(fetchEmployeesAsync.pending, (state) => {
            state.status = 'pendingFetchEmployees';
        });
        builder.addCase(fetchEmployeesAsync.fulfilled, (state, action) => {
            employeesAdapter.setAll(state, action.payload);
            state.status = 'idle';
            state.employeesLoaded = true;
        });
        builder.addCase(fetchEmployeesAsync.rejected, (state, action) => {
            console.log(action.payload);
            state.status = 'idle';
        });
        builder.addCase(fetchEmployeeAsync.pending, (state) => {
            state.status = 'pendingFetchEmployee';
        });
        builder.addCase(fetchEmployeeAsync.fulfilled, (state, action) => {
            employeesAdapter.upsertOne(state, action.payload);
            state.status = 'idle';
        });
        builder.addCase(fetchEmployeeAsync.rejected, (state, action) => {
            console.log(action);
            state.status = 'idle';
        });
        builder.addCase(fetchFilters.pending, (state) => {
            state.status = 'pendingFetchFilters';
        });
        builder.addCase(fetchFilters.fulfilled, (state, action) => {
            state.skills = action.payload.skills;
            state.jobs = action.payload.jobs;
            state.filtersLoaded = true;
            state.status = 'idle';
        });
        builder.addCase(fetchFilters.rejected, (state, action) => {
            state.status = 'idle';
            console.log(action.payload);
        })
    })
})

export const employeeSelectors = employeesAdapter.getSelectors((state: RootState) => state.catalog);

export const {setEmployeeParams, resetEmployeeParams, setMetaData, setPageNumber} = catalogSlice.actions;