export interface IResult {
    category: string;
    numberOfQuestions: number;
    numberOfCorrectAnswers: number,
}

export class Result implements IResult {

    category: string;
    numberOfQuestions: number;
    numberOfCorrectAnswers: number;

    constructor(category: string, numberOfQuestions: number,  numberOfCorrectAnswers: number){
        this.category = category;
        this.numberOfQuestions = numberOfQuestions;
        this.numberOfCorrectAnswers = numberOfCorrectAnswers;

    }

}
