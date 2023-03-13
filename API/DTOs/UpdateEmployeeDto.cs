using System.ComponentModel.DataAnnotations;

namespace API.DTOs
{
    public class UpdateEmployeeDto
    {
        public int Id { get; set; }
        [Required]
        public string UserName { get; set; }

        [Required]
        public string Email { get; set; }

        [Required]
        public string Skill { get; set; }

        [Required]
        public string Job { get; set; }

    }
}
