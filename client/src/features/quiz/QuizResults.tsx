import { Category } from '@mui/icons-material';
import { Card, CardActions, CardContent, Checkbox, FormControlLabel, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { Question } from '../../app/models/questions';
import { Result } from '../../app/models/result';

interface Props {
    results: Result[]
}

export default function QuizResults({ results }: Props) {
    const [loading, setLoading] = useState(true);

    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
            <TableHead>
                <TableRow>
                <TableCell>Category</TableCell>
                <TableCell align="right">Result(s)</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
            {results.map(result => (
                        <TableRow
                            key={result.category}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                {result.category}
                            </TableCell>
                            <TableCell align="right">{result.numberOfCorrectAnswers}/{result.numberOfQuestions}</TableCell>
                        </TableRow>
            ))}
        </TableBody>
            </Table>
        </TableContainer>

    )}