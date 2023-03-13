using API.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.Azure.Cosmos;

namespace API.RequestHelpers.Services
{
    public class CosmosDbService : ICosmosDbService
    {
        private readonly Container _container;
        private const string allQuestionsQuery= "SELECT * FROM c";

        public CosmosDbService(
            CosmosClient cosmosDbClient,
            string databaseName,
            string containerName)
        {
            _container = cosmosDbClient.GetContainer(databaseName, containerName);
        }

        public async Task AddQuestionAsync(Question question)
        {
            await _container.CreateItemAsync(question, new PartitionKey(question.Id));
        }

        public async Task DeleteQuestionAsync(string id)
        {
            await _container.DeleteItemAsync<Question>(id, new PartitionKey(id));
        }

        public async Task<Question> GetQuestionAsync(string id)
        {
            try
            {
                var response = await _container.ReadItemAsync<Question>(id, new PartitionKey(id));
                return response.Resource;
            }
            catch (CosmosException) //For handling item not found and other exceptions
            {
                return null;
            }
        }

        public async Task<IEnumerable<Question>> GetQuestionsAsync()
        {
            return await GetAllQuestions(allQuestionsQuery);
        }

        public async Task<IEnumerable<Question>> GetQuestionsByCategoryAsync(string category)
        {
            var questionsByCategoryQuery = $"WHERE c.category LIKE \"%{category}%\""; 
            var questions = await GetAllQuestions($"{allQuestionsQuery} {questionsByCategoryQuery}");
            return questions.Take(5);
        }

        private async Task<IEnumerable<Question>> GetAllQuestions(string queryString)
        {
            var query = _container.GetItemQueryIterator<Question>(new QueryDefinition(queryString));
            var results = new List<Question>();
            while (query.HasMoreResults)
            {
                var response = await query.ReadNextAsync();
                results.AddRange(response.ToList());
            }
            return results;
        }

        public async Task<IEnumerable<string>> GetCategories()
        {
            var questions = await GetAllQuestions(allQuestionsQuery);
            return questions
                .Select(x => x.Category)
                .Distinct();

        }
    }
}
