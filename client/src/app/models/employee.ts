export  interface Employee {
    id: number;
    userName: string;
    email: string;
    skill?: string;
    job: string;
}

export interface EmployeeParams {
    orderBy: string;
    searchTerm?: string;
    skills: string[];
    jobs: string[];
    pageNumber: number;
    pageSize: number;
} 