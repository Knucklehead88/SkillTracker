export interface Question {
    id: string;
    questionText: string;
    options: string[],
    correctAnswer: string;
    valid: boolean;
    category: string;
}