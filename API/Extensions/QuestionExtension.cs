using API.Entities;
using Microsoft.Azure.Documents.SystemFunctions;

namespace API.Extensions
{
    public static class QuestionExtension
    {
        public static bool IsValid(this QuestionManager questionManager)
        {
            //return (questionManager.Question.IsNotNullOrEmpty() && questionManager.AnswerA.IsNotNullOrEmpty()
            //    && questionManager.AnswerB.IsNotNullOrEmpty() && !questionManager.AnswerC.IsNotNullOrEmpty()
            //    && questionManager.AnswerD.IsNotNullOrEmpty() && questionManager.Category.IsNotNullOrEmpty()
            //    && questionManager.CorrectAnswer.IsNotNullOrEmpty());
            return questionManager.GetType().GetProperties()
                            .All(p => p.GetValue(questionManager) != null);
        }
    }
}

