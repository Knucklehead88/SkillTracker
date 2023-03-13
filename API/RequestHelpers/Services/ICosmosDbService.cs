using API.Entities;

namespace API.RequestHelpers.Services
{
    public interface ICosmosDbService
    {
        Task<IEnumerable<Question>> GetQuestionsAsync();
        Task<IEnumerable<Question>> GetQuestionsByCategoryAsync(string category);
        Task<IEnumerable<string>> GetCategories();
        Task<Question> GetQuestionAsync(string id);
        Task AddQuestionAsync(Question item);
        Task DeleteQuestionAsync(string id);
    }
}
