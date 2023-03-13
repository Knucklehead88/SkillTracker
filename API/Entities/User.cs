using Microsoft.AspNetCore.Identity;

namespace API.Entities
{
    public class User : IdentityUser<int>
    {
        public UserAddress Address { get; set; }

        public string? Skill { get; set; }

        public string? Job { get; set; }


    }
}