import { Category } from '@mui/icons-material';
import { Checkbox, FormControlLabel, Grid, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import agent from '../../app/api/agent';
import AppCheckbox from '../../app/components/AppCheckbox';
import AppTextInput from '../../app/components/AppTextInput';
import { Question } from '../../app/models/questions';

interface Props {
    category: string
}

export default function QuizForm({ category }: Props) {
    const { control } = useFormContext();
    const [questions, setQuestions] = useState<Question[] | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        agent.Question.listByCategory(category)
            .then(questions => setQuestions(questions))
            .catch(error => console.log(error))
            .finally(() => setLoading(false));
    }, [category]);


    return (
        <>
            <Typography variant="h6" gutterBottom>
                {category}
            </Typography>
            <Grid container spacing={3}>
            {questions?.map((question) => (
                <>
                <Grid item xs={12} sm={12} key={question.id}>
                    <Typography variant="h6">{question.questionText}</Typography>
                </Grid>
                {/*<Grid item xs={12} sm={4}>
                 <AppCheckbox 
                    disabled= {false}
                    name='answerA' 
                    label={question.answerA} 
                    control={control} />
                </Grid>
                <Grid item xs={12} sm={4}>
                <AppCheckbox 
                    disabled= {false}
                    name='answerB' 
                    label={question.answerB} 
                    control={control} />
                </Grid>
                <Grid item xs={12} sm={4}>
                <AppCheckbox 
                    disabled= {false}
                    name='answerC' 
                    label={question.answerC} 
                    control={control} />
                </Grid> */}
                {/* <Grid item xs={12} sm={4}>
                <FormControlLabel
                    control={<Checkbox color="secondary" name="answerA" value="yes" />}
                    label={question.answerA}
                />
                </Grid>    
                <Grid item xs={12} sm={4}>
                <FormControlLabel
                    control={<Checkbox color="secondary" name="answerB" value="yes" />}
                    label={question.answerB}
                />
                </Grid> 
                <Grid item xs={12} sm={4}>
                <FormControlLabel
                    control={<Checkbox color="secondary" name="answerC" value="yes" />}
                    label={question.answerC}
                />
                </Grid>  */}
                </>
            ))}
            </Grid>
        </>
    )
}