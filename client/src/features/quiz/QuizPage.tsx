import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Button, Typography, Grid, Stepper, Step, StepLabel, Box } from "@mui/material";
import { useEffect, useState } from "react";
import { FieldValues, FormProvider, useForm } from "react-hook-form";
import agent from "../../app/api/agent";
import LoadingComponent from "../../app/layout/LoadingComponent";
import { Question } from "../../app/models/questions";
import AppTextInput from "../../app/components/AppTextInput";
import AppCheckbox from "../../app/components/AppCheckbox";
import { useFormContext } from "react-hook-form";
import { useAppDispatch } from "../../app/store/configureStore";
import { LoadingButton } from "@mui/lab";
import QuizForm from "./QuizForm";
import { QuestionAnswer } from "@mui/icons-material";
import QuestionCard from "./QuestionCard";

export default function QuizPage() {
    const [categories, setCategories] = useState<string[] | null>(null);
    const [questions, setQuestions] = useState<Question[] | null>(null);
    const [activeStep, setActiveStep] = useState(0);
    const [loading, setLoading] = useState(true);
    const [category, setCategory] = useState("");
    const [answers, setAnswers] = useState(0);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const currentQuestion = questions?.[currentQuestionIndex];
    const finishedQuiz = currentQuestionIndex === questions?.length;

    const methods = useForm();

    useEffect(() => {
        setCategory(steps[activeStep]);
        setLoading(true);
    },[activeStep]);

    useEffect(() => {
        agent.Question.categories()
            .then(categories => setCategories(categories))
            .catch(error => console.log(error))
            .finally(() => setLoading(false));
    }, [methods])

    useEffect(() => {
        agent.Question.listByCategory(category)
            .then(questions => setQuestions(questions.slice(0, 5)))
            .catch(error => console.log(error))
            .finally(() => setLoading(false));
    }, [category]);


    let regex = /•.*[A-Za-z]/i;
    let steps: string[] = [];

    categories?.forEach((category:string) => {
        if(regex.test(category)){
            steps.push(category.substring(1));
        }
    });

    if (loading) return <LoadingComponent message='Loading questions' />

    const handleNext = async (data: FieldValues) => {
        setActiveStep((prevState) => prevState + 1);
        setCurrentQuestionIndex(0);
    }

    const submitAnswer = (value:boolean) => {
        setAnswers((prevState) => value == true ? prevState + 1 : prevState)
        setCurrentQuestionIndex((prevState) => prevState + 1);
    }

    return (
        <FormProvider {...methods}>
            <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
                <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
                    {steps?.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
                <form onSubmit={methods.handleSubmit(handleNext)}>
                    {finishedQuiz ? (
                             <>
                                    <Typography variant="h5" gutterBottom>
                                        Thank you completing the {category} quiz!
                                    </Typography>
                                    <Typography variant="subtitle1">
                                        Please click next to go to the next quiz!
                                    </Typography>
                            </>
                    ):(
                    <QuestionCard question={currentQuestion} questionNumber ={currentQuestionIndex + 1}
                        submitAnswer={submitAnswer}/>
                    )}
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <LoadingButton
                                        loading={loading}
                                        disabled={!finishedQuiz}
                                        variant="contained"
                                        type='submit'
                                        sx={{ mt: 3, ml: 1 }}
                                    >
                                        {activeStep === steps.length - 1 ? 'Submit' : 'Next'}
                                    </LoadingButton>
                    </Box>
                </form>
            </Paper>
        </FormProvider>
    );
} 