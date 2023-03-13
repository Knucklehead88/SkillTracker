using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Newtonsoft.Json;

namespace API.Entities
{
    public class Question
    {
        [JsonProperty(PropertyName = "id")]
        public string Id { get; set; }

        [JsonProperty(PropertyName = "questiontext")]       
        public string QuestionText { get; set; }

        [JsonProperty(PropertyName = "options")]
        public List<string> Options { get; set; } = new List<string>();

        [JsonProperty(PropertyName = "correctanswer")]
        public string CorrectAnswer { get; set; }
        
        [JsonProperty(PropertyName = "category")]
        public string Category { get; set; }
             
    }
}