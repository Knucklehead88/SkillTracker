using System.Data;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Text;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.RequestHelpers.Services;
using API.Services;
using ClosedXML.Excel;
using DocumentFormat.OpenXml.Spreadsheet;
using ExcelDataReader;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class QuestionController : BaseApiController
    {

        private readonly ICosmosDbService _cosmosDbService;
        public QuestionController(ICosmosDbService cosmosDbService)
        {
            _cosmosDbService = cosmosDbService ?? throw new ArgumentNullException(nameof(cosmosDbService));
        }

        // GET api/question
        [HttpGet]
        public async Task<IActionResult> List()
        {
            return Ok(await _cosmosDbService.GetQuestionsAsync());
        }
        // GET api/question/5
        [HttpGet("{id}")]
        public async Task<IActionResult> Get(string id)
        {
            _ = Guid.TryParse(id, out var questionId); 
            if(questionId == Guid.Empty)
            {
                return Ok(await _cosmosDbService.GetQuestionsByCategoryAsync(id));
            }
            return Ok(await _cosmosDbService.GetQuestionAsync(id));
        }

        //// GET api/question/categories
        [HttpGet("categories")]
        public async Task<IActionResult> GetCategories()
        {
            return Ok(await _cosmosDbService.GetCategories());
        }

        // POST api/question
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Question item)
        {
            item.Id = Guid.NewGuid().ToString();
            await _cosmosDbService.AddQuestionAsync(item);
            return CreatedAtAction(nameof(Get), new { id = item.Id }, item);
        }

        // DELETE api/items/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            await _cosmosDbService.DeleteQuestionAsync(id);
            return NoContent();
        }
        
    }
}