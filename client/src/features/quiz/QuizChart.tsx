import { Paper } from "@mui/material";
import { Result } from "../../app/models/result";
import Chart from "../chart/Chart";

interface Props {
    results: Result[]
}

export default function QuizForm({ results }: Props) {
    // Sample data
const data:{ label:string, value: number} [] = results.map(r => ({ label: r.category, value: r.numberOfCorrectAnswers}));

return <Chart dataPoints={data}/>;

}