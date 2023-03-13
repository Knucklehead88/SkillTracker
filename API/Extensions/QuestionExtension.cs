using API.Entities;
using Microsoft.Azure.Documents.SystemFunctions;

namespace API.Extensions
{
    public static class QuestionExtension
    {
        public static bool IsValid(this Question question)
        {
            return !string.IsNullOrEmpty(question.QuestionText) &&
                    question.Options
                    .All(o => !string.IsNullOrEmpty(o) || !string.IsNullOrWhiteSpace(o));
        }
    }
}

