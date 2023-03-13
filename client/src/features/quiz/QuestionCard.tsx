import { RadioButtonCheckedSharp } from "@mui/icons-material";
import { Box, Button, Card, CardActions, CardContent, CssBaseline, FormControl, FormControlLabel, Radio, RadioGroup, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import agent from "../../app/api/agent";
import { Question } from "../../app/models/questions";

interface Props {
    question: Question | undefined;
    questionNumber: number;
    submitAnswer: (answer:boolean) => void;
}

let correctAnswerMapping = new Map<number, string>([
    [0, "A"],
    [1, "B"],
    [2, "C"],
    [3, "D"]
]);

export default function QuestionCard({ question, questionNumber, submitAnswer }: Props) {
    const [value, setValue] = useState(null);
    
  const handleChangeRadio = (e:any) => {
    setValue(e.target.value);
  }

  const isCorrectAnswer = (value: any) => {
    if(question?.correctAnswer.length! > 1) {
        return question?.correctAnswer === value;
    }
    const selectedAnswer = question?.options.findIndex(o => o === value!);
    return correctAnswerMapping.get(selectedAnswer!) === question?.correctAnswer;
  }

  const handleSubmit = () => {
    isCorrectAnswer(value);
    submitAnswer(isCorrectAnswer(value));
    setValue(null);
  }

    return (
                    <Box sx={{ minWidth: 275 }} key={question?.id}>
                        <Card variant="outlined">
                        <CardContent>

                        <Typography variant="h5" component="div">
                            Question {questionNumber}
                        </Typography>
                        <Typography sx={{ mb: 1.5 }} color="text.secondary">
                            {question?.questionText}
                        </Typography>

                        <FormControl>
                            <RadioGroup name="radio-group-quiz" value={value} onChange={handleChangeRadio}>
                                {question?.options.map((o, i) => {
                                    return <FormControlLabel key={i + 1} value={o} control={<Radio />} label={o} />
                                })}
                            </RadioGroup>
                        </FormControl>
        
                        </CardContent>
                        <CardActions>
                            <Button disabled={!value} 
                                onClick={handleSubmit} fullWidth variant="outlined" size="small">Next Question
                            </Button>
                        </CardActions>
                        </Card>
                    </Box>
    )
}