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
                var user = new User
                {
                    UserName = "bob",
                    Email = "bob@test.com"
                };

                await userManager.CreateAsync(user, "Pa$$w0rd");
                await userManager.AddToRoleAsync(user, "Member");

                var admin = new User
                {
                    UserName = "admin",
                    Email = "admin@test.com"
                };

                await userManager.CreateAsync(admin, "Pa$$w0rd");
                await userManager.AddToRolesAsync(admin, new[] {"Member", "Admin"});
            }

            if (context.Products.Any()) return;

            var products = new List<Product>
            {
                new Product
                {
                    Name = "Tiles",
                    Description =
                        "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Maecenas porttitor congue massa. Fusce posuere, magna sed pulvinar ultricies, purus lectus malesuada libero, sit amet commodo magna eros quis urna.",
                    Price = 20000,
                    PictureUrl = "/images/products/tiles.png",
                    Brand = "Tiles",
                    Type = "Tiles",
                    QuantityInStock = 100
                },
                new Product
                {
                    Name = "Sink 1",
                    Description = "Nunc viverra imperdiet enim. Fusce est. Vivamus a tellus.",
                    Price = 15000,
                    PictureUrl = "/images/products/sink.png",
                    Brand = "IKEA",
                    Type = "Sink",
                    QuantityInStock = 100
                },
                new Product
                {
                    Name = "Sink 2",
                    Description =
                        "Suspendisse dui purus, scelerisque at, vulputate vitae, pretium mattis, nunc. Mauris eget neque at sem venenatis eleifend. Ut nonummy.",
                    Price = 18000,
                    PictureUrl = "/images/products/sink2.png",
                    Brand = "Leroy",
                    Type = "Sink",
                    QuantityInStock = 100
                },
                new Product
                {
                    Name = "Door Knob",
                    Description =
                        "Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Proin pharetra nonummy pede. Mauris et orci.",
                    Price = 30000,
                    PictureUrl = "/images/products/knob.png",
                    Brand = "IKEA",
                    Type = "Knob",
                    QuantityInStock = 100
                },
                new Product
                {
                    Name = "Granit",
                    Description =
                        "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Maecenas porttitor congue massa. Fusce posuere, magna sed pulvinar ultricies, purus lectus malesuada libero, sit amet commodo magna eros quis urna.",
                    Price = 25000,
                    PictureUrl = "/images/products/granit.png",
                    Brand = "HomeDepo",
                    Type = "Granit",
                    QuantityInStock = 100
                },
                new Product
                {
                    Name = "Kitchen Cabinet1",
                    Description =
                        "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Maecenas porttitor congue massa. Fusce posuere, magna sed pulvinar ultricies, purus lectus malesuada libero, sit amet commodo magna eros quis urna.",
                    Price = 12000,
                    PictureUrl = "/images/products/kitchen.png",
                    Brand = "HomeDepo",
                    Type = "Cabinet",
                    QuantityInStock = 100
                },
                new Product
                {
                    Name = "Kitchen Cabinet2",
                    Description =
                        "Fusce posuere, magna sed pulvinar ultricies, purus lectus malesuada libero, sit amet commodo magna eros quis urna.",
                    Price = 1000,
                    PictureUrl = "/images/products/kitchen2.png",
                    Brand = "HomeDepo",
                    Type = "Cabinet",
                    QuantityInStock = 100
                },
                new Product
                {
                    Name = "Kitchen Cabinet3",
                    Description =
                        "Fusce posuere, magna sed pulvinar ultricies, purus lectus malesuada libero, sit amet commodo magna eros quis urna.",
                    Price = 8000,
                    PictureUrl = "/images/products/kitchen4.png",
                    Brand = "Leroy",
                    Type = "Cabinet",
                    QuantityInStock = 100
                }
            };

            foreach (var product in products)
            {
                context.Products.Add(product);
            }

            context.SaveChanges();
        }
    }
}