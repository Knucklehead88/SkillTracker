using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Entities;
using Microsoft.AspNetCore.Identity;

namespace API.Data
{
    public static class DbInitializer
    {
        public static async Task Initialize(StoreContext context, UserManager<User> userManager)
        {
            if (!userManager.Users.Any())
            {
                var bob = new User
                {
                    UserName = "bob",
                    Email = "bob@nttdata.com",
                    Skill = ".NET",
                    Job = "Programmer"

                };

                await userManager.CreateAsync(bob, "Pa$$w0rd");
                await userManager.AddToRoleAsync(bob, "Member");

                var silviu = new User
                {
                    UserName = "silviu",
                    Email = "silviu@nttdata.com",
                    Skill="ReactJS",
                    Job = "Frontend"
                };

                await userManager.CreateAsync(silviu, "Pa$$w0rd");
                await userManager.AddToRoleAsync(silviu, "Member");


                var john = new User
                {
                    UserName = "silviu",
                    Email = "silviu@nttdata.com",
                    Skill = "ReactJS",
                    Job = "Frontend"
                };

                await userManager.CreateAsync(john, "Pa$$w0rd");
                await userManager.AddToRoleAsync(john, "Member");

                var admin = new User
                {
                    UserName = "admin",
                    Email = "admin@test.com",
                    Skill = "Angular",
                    Job = "Frontend"
                };

                await userManager.CreateAsync(admin, "Pa$$w0rd");
                await userManager.AddToRolesAsync(admin, new[] { "Member", "Admin" });

                var michael = new User
                {
                    UserName = "Michael",
                    Email = "michael@test.com",
                    Skill = "C#",
                    Job = "Backend"
                };

                await userManager.CreateAsync(admin, "Pa$$w0rd");
                await userManager.AddToRolesAsync(admin, new[] { "Member", "Admin" });
            }

 

            context.SaveChanges();
        }
    }
}