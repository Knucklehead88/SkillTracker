using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
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
        private readonly UserManager<User> _userManager;
        private readonly StoreContext _context;
        private readonly CosmosContext _cosmosContext;

        public FileController(UserManager<User> userManager, StoreContext context, CosmosContext cosmosContext)
        {
            _context = context;
            _cosmosContext = cosmosContext;
            _userManager = userManager;
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

                var questions = new List<QuestionManager>();

                GetAllQuestions(files, questions);
                //GetAllQuestionsFromExcel(files, questions);


                await _cosmosContext.Questions?.AddRangeAsync(questions);


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

        private void GetAllQuestionsFromExcel(List<IFormFile> files, List<QuestionManager> questions)
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
                            var question = new QuestionManager
                            {
                                Id = Guid.NewGuid().ToString(),
                                Question = reader.GetValue(0).ToString(),
                                AnswerA = reader.GetValue(1).ToString(),
                                AnswerB = reader.GetValue(2).ToString(),
                                AnswerC = reader.GetValue(3).ToString(),
                                AnswerD = reader.GetValue(4).ToString(),
                                CorrectAnswer = reader.GetValue(5).ToString(),
                                //Category = reader.HeaderFooter.Worksheet?.ToString()
                            };

                            questions.Add(question);
                        }
                    }
                } while (reader.NextResult());
            }
        }

        private static void GetAllQuestions(List<IFormFile> files, List<QuestionManager> questions)
        {
            foreach (var file in files)
            {
                var fileextension = Path.GetExtension(file.FileName);
                var filename = Guid.NewGuid().ToString() + fileextension;
                var filepath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "files", filename);
                //var filepath = Path.GetTempFileName();
                using (FileStream fs = System.IO.File.Create(filepath))
                {
                    file.CopyTo(fs);
                }
                XLWorkbook workbook = XLWorkbook.OpenFromTemplate(filepath);
                //var sheets = workbook.Worksheets;
                //var rows = sheets.Rows().ToList();

                foreach (var sheet in workbook.Worksheets)
                {
                    foreach (var row in sheet.Rows().ToList())
                    {
                        var test = row.Cell(1).Value.ToString();
                        if (string.IsNullOrWhiteSpace(test) || string.IsNullOrEmpty(test))
                        {
                            break;
                        }
                        var question = new QuestionManager
                        {
                            Id = Guid.NewGuid().ToString(),
                            Question = row.Cell(1).Value.ToString(),
                            AnswerA = row.Cell(2).Value.ToString(),
                            AnswerB = row.Cell(2).Value.ToString(),
                            AnswerC = row.Cell(3).Value.ToString(),
                            AnswerD = row.Cell(4).Value.ToString(),
                            CorrectAnswer = row.Cell(5).Value.ToString(),
                            Category = row.Worksheet?.ToString()
                        };

                        if (question.IsValid())
                        {
                            questions.Add(question);
                        }
                    }
                }


            }
        }
    }
}