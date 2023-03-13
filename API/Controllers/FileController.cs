using System.Data;
using System.Linq;
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
    public class FileController : BaseApiController
    {
        private readonly ICosmosDbService _cosmosDbService;


        public FileController(ICosmosDbService cosmosDbService)
        {
            _cosmosDbService = cosmosDbService ?? throw new ArgumentNullException(nameof(cosmosDbService));

        }

        [HttpPost("upload")]
        public async Task<ActionResult<UploadDto>> OnPostUpload(List<IFormFile> files)
        {
            try
                {
                    if(files == null)
                        throw new Exception("File is Not Received...");

                    var questions = new List<Question>();

                    await UploadAllQuestions(files, questions);

                    return new UploadDto
                    {
                        Status = true,
                        Message = "Data Updated Successfully",
                        StatusCode = System.Net.HttpStatusCode.OK.ToString()
                    };
                }
                catch (Exception e)
            {
                throw e;
            }
        }

        private async Task UploadAllQuestions(List<IFormFile> files, List<Question> questions)
        {
            foreach (var file in files)
            {
                var fileextension = Path.GetExtension(file.FileName);
                var filename = Guid.NewGuid().ToString() + fileextension;
                var filepath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "files", filename);
                using (FileStream fs = System.IO.File.Create(filepath))
                {
                    file.CopyTo(fs);
                }
                XLWorkbook workbook = XLWorkbook.OpenFromTemplate(filepath);

                foreach (var sheet in workbook.Worksheets)
                {
                    foreach (var row in sheet.Rows(2, sheet.Rows().Count()-1).ToList())
                    {
                        var test = row.Cell(1).Value.ToString();
                        if (string.IsNullOrWhiteSpace(test) || string.IsNullOrEmpty(test))
                        {
                            break;
                        }
                        var question = new Question
                        {
                            Id = Guid.NewGuid().ToString(),
                            QuestionText = row.Cell(1).Value.ToString(),
                            Options = new List<string>{
                                row.Cell(2).Value.ToString(),
                                row.Cell(3).Value.ToString(),
                                row.Cell(4).Value.ToString(),
                                row.Cell(5).Value.ToString()
                            },
                            CorrectAnswer = row.Cell(6).Value.ToString(),
                            Category = row.Worksheet?.ToString()
                        };

                        if (question.IsValid())
                        {
                            questions.Add(question);
                            await _cosmosDbService.AddQuestionAsync(question);

                        }
                    }
                }


            }
        }
    }
}