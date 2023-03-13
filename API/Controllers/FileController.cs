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

        //[HttpPost("upload")]
        //public async Task<IActionResult> OnPostUploadAsync(List<IFormFile> files)
        //{
        //    long size = files.Sum(f => f.Length);

        //    foreach (var formFile in files)
        //    {
        //        if (formFile.Length > 0)
        //        {
        //            var filePath = Path.GetTempFileName();

        //            using (var stream = System.IO.File.Create(filePath))
        //            {
        //                await formFile.CopyToAsync(stream);
        //            }
        //        }
        //    }

        // Process uploaded files
        // Don't rely on or trust the FileName property without validation.

        //return Ok(new { count = files.Count, size });


        [HttpPost("upload")]
        public async Task<ActionResult<UploadDto>> OnPostUpload(List<IFormFile> files)
        {
            try
                {
                    if(files == null)
                        throw new Exception("File is Not Received...");

                    var questions = new List<Question>();

                    await GetAllQuestions(files, questions);
                    //GetAllQuestionsFromExcel(files, questions);


                    //await _cosmosContext.Questions?.AddRangeAsync(questions);


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

        private void GetAllQuestionsFromExcel(List<IFormFile> files, List<Question> questions)
        {
            if (files == null)
                return;

            foreach (var file in files)
            {
                var fileExtension = Path.GetExtension(file.FileName);
                var filename = Guid.NewGuid().ToString() + fileExtension;
                var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "files", filename);
                //var filepath = Path.GetTempFileName();
                using (FileStream fs = System.IO.File.Create(filePath))
                {
                    file.CopyTo(fs);
                }
                Encoding.RegisterProvider(CodePagesEncodingProvider.Instance);

                using var stream = System.IO.File.Open(filePath, FileMode.Open, FileAccess.Read);
                using var reader = ExcelReaderFactory.CreateReader(stream);
                do
                {
                    while(reader.Read())
                    {
                        for (int column = 0; column < reader.FieldCount; column++)
                        {
                            Console.WriteLine(reader.GetValue(column));
                            var question = new Question
                            {
                                Id = Guid.NewGuid().ToString(),
                                QuestionText = reader.GetValue(0).ToString(),
                                CorrectAnswer = reader.GetValue(5).ToString(),
                                //Category = reader.HeaderFooter.Worksheet?.ToString()
                            };

                            questions.Add(question);
                        }
                    }
                } while (reader.NextResult());
            }
        }

        private async Task GetAllQuestions(List<IFormFile> files, List<Question> questions)
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
                //var sheets = workbook.Worksheets;
                //var rows = sheets.Rows().ToList();

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