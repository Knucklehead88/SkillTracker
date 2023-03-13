using API.Entities;
using Microsoft.Azure.Cosmos;
using Microsoft.Azure.Documents;
using Microsoft.Azure.Documents.Client;
using Microsoft.EntityFrameworkCore;
using Database = Microsoft.Azure.Documents.Database;

namespace API.Data
{

    public class CosmosContext: DbContext
    {
        public DbSet<Question> Questions { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            //optionsBuilder.UseCosmos(
            //    "https://skilltracker-2023.documents.azure.com:443/",
            //    "HBSQvhO6YoZqEWbHo3285knC0HWh4fdJJNodILSCUx8tPByjErz8O3iV6yv8wfqnQVNHwWZR6HnsACDbGc5BCw==",
            //    databaseName: "quiz-db"
            //    );

            optionsBuilder.UseCosmos(
                "https://localhost:8081",
                "C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw/Jw==",
                databaseName: "QuizDb"
    );
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<Question>()
                .ToContainer("QuestionManager")
                .HasPartitionKey(e => e.Id);


        }
    }



}

