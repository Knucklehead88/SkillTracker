using Microsoft.Extensions.Options;

namespace API.Services
{
    public interface IEmailSender
    {
        public AuthMessageSenderOptions Options { get; } 
        Task SendEmailAsync(string toEmail, string subject, string message);
        Task Execute(string apiKey, string subject, string message, string toEmail);
    }
}