import { Container, createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { Route, Switch } from "react-router";
import { ToastContainer } from "react-toastify";
import Catalog from "../../features/catalog/Catalog";
import EmployeeDetails from "../../features/catalog/EmployeeDetails";
import HomePage from "../../features/home/HomePage";
import Header from "./Header";
import 'react-toastify/dist/ReactToastify.css';
import ServerError from "../errors/ServerError";
import NotFound from "../errors/NotFound";
import LoadingComponent from "./LoadingComponent";
import { useAppDispatch } from "../store/configureStore";
import Register from "../../features/account/Register";
import Login from "../../features/account/Login";
import { fetchCurrentUser } from "../../features/account/accountSlice";
import PrivateRoute from "./PrivateRoute";
import BasketPage from "../../features/basket/BasketPage";
import { fetchBasketAsync, setBasket } from "../../features/basket/basketSlice";
import QuizPage from "../../features/quiz/QuizPage";

function App() {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);

    const initApp = useCallback(async () => {
      try{
        await dispatch(fetchCurrentUser());
        await dispatch(fetchBasketAsync());
      } catch (error) {
        console.log(error);
      }
    }, [dispatch])
    

  useEffect(() => {
    initApp().then(() => setLoading(false));
  }, [initApp]);

  const [darkMode, setDarkMode] = useState(false);
  const paletteType = darkMode ? 'dark' : 'light'
  const theme = createTheme({
    palette: {
      mode: paletteType,
      background: {
        default: paletteType === 'light' ? '#eaeaea' : '#121212'
      }
    }
  })

  function handleThemeChange() {
    setDarkMode(!darkMode);
  }

  if (loading) return <LoadingComponent message='Initialising app...' />

  return (
    <ThemeProvider theme={theme}>
      <ToastContainer position='bottom-right' hideProgressBar theme='colored' />
      <CssBaseline />
      <Header darkMode={darkMode} handleThemeChange={handleThemeChange} />
      <Container>
        <Switch>
          <Route exact path='/' component={HomePage} />
          <Route exact path='/quiz' component={QuizPage} />
          <Route exact path='/employees' component={Catalog} />
          <Route path='/employees/:id' component={EmployeeDetails} />
          <Route path='/server-error' component={ServerError} />
          <Route path='/register' component={Register} />
          <Route path='/login' component={Login} />
          <Route component={NotFound} />
        </Switch>
      </Container>
    </ThemeProvider>
  );
}

export default App;
