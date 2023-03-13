using API.DTOs;
using API.Entities;
using AutoMapper;

namespace API.RequestHelpers
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            CreateMap<CreateProductDto, Product>();
            CreateMap<UpdateProductDto, Product>();
            CreateMap<UpdateEmployeeDto, User>();
            CreateMap<BasketDto, Basket>().ReverseMap();
            CreateMap<BasketItemDto, BasketItem>().ReverseMap();

        }
    }
}