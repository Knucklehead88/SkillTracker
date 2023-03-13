import axios, { AxiosError, AxiosResponse } from "axios";
import { resolve } from "path";
import { toast } from "react-toastify";
import { AnyAction } from "redux";
import { history } from "../..";
import { PaginatedResponse } from "../models/pagination";
import { store } from "../store/configureStore";

// const sleep = () => new Promise(resolve => setTimeout(resolve, 500));

axios.defaults.baseURL = 'http://localhost:5000/api/';
axios.defaults.withCredentials = true;

const responseBody = (response: AxiosResponse) => response.data;

axios.interceptors.request.use(config => {
    const token = store.getState().account.user?.token;
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
})



axios.interceptors.response.use(async response => {
    // await sleep();
    const pagination = response.headers['pagination'];
    if (pagination) {
        response.data = new PaginatedResponse(response.data, JSON.parse(pagination));
        return response;
    }
    return response
}, (error: AxiosError) => {
    // @ts-ignore
    const {data, status} = error.response;
    switch (status){
        case 400:
            if (data.errors){
                const modelStateErrors: string[] = [];   
                for (const key in data.errors)
                {
                    if(data.errors[key]) {
                        modelStateErrors.push(data.errors[key]);
                    }   
                } 
                throw modelStateErrors.flat();
            }
            toast.error(data.title);
            break;
        case 401:
            toast.error(data.title);
            break;
        case 500:
            history.push({
                pathname: "/server-error",
                state: {error: data}
            });
            break;
        default:
            break;
    }   
    return Promise.reject(error.response);
});

const requests = {
    get: (url: string, params?: URLSearchParams) => axios.get(url, {params}).then(responseBody),
    post: (url: string, body: {}) => axios.post(url,body).then(responseBody),
    put: (url: string, body: {}) => axios.put(url, body).then(responseBody),
    delete: (url: string) => axios.delete(url).then(responseBody),
}

const Employees = {
    list: (params: URLSearchParams) => requests.get('employee', params),
    details: (id: number) => requests.get(`employee/${id}`),
    fetchFilters: () => requests.get('employee/filters')
}

const TestErrors = {
    get400Error: () => requests.get('buggy/bad-request'),
    get401Error: () => requests.get('buggy/unautharized'),
    get404Error: () => requests.get('buggy/not-found'),
    get500Error: () => requests.get('buggy/server-error'),
    getValidationError: () => requests.get('buggy/validation-error'),
}

const Basket = {
    get: () => requests.get('basket'),
    addItem: (productId: number, quantity = 1) => requests.post(`basket?productId=${productId}&quantity=${quantity}`, {}),
    removeItem: (productId: number, quantity = 1) => requests.delete(`basket?productId=${productId}&quantity=${quantity}`),
}

const Account = {
    login: (values: any) => requests.post('account/login', values),
    register: (values: any) => requests.post('account/register', values),
    currentUser: () => requests.get('account/currentUser'),
    fetchAddress: () => requests.get('account/savedAddress')
}

const File = {
    upload: (files: any) => requests.post('file/upload', files)
}

const Question = {
    list: () => requests.get('question'),
    listByCategory: (category: string) => requests.get(`question/${category}`),
    fetch: (id: string) => requests.get(`question/${id}`),
    categories: () => requests.get('question/categories'),
    create: (values: any) => requests.post('question', values),
    remove: (id: string) => requests.delete(`question?id=${id}`),
}

const agent = {
    Employees,
    TestErrors,
    Basket,
    Account,
    File,
    Question
}

export default agent; 