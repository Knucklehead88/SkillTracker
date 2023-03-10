using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.RequestHelpers;
using API.Services;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class EmployeeController : BaseApiController
    {
        private readonly StoreContext _context;
        private readonly IMapper _mapper;
        private readonly ImageService _imageService;
        private readonly UserManager<User> _userManager;

        public EmployeeController(UserManager<User> userManager, StoreContext context, IMapper mapper)
        {
            //_imageService = imageService;
            _mapper = mapper;
            _context = context;
            _userManager = userManager;

        }

        [HttpGet]
        public async Task<ActionResult<PagedList<User>>> GetEmployees([FromQuery] UserParams userParams)
        {
            var query = _userManager.Users
                .Sort(userParams.OrderBy)
                .Search(userParams.SearchTerm)
                .Filter(userParams.Skills, userParams.Jobs)
                .AsQueryable();

            var users = await PagedList<User>.ToPagedList(query,
                userParams.PageNumber, userParams.PageSize);

            Response.AddPaginationHeader(users.MetaData);

            return users;
        }

        [HttpGet("{id}", Name = "GetEmployee")]
        public async Task<ActionResult<User>> GetEmployee(int id)
        {
            var user =  await _userManager.Users
                .FirstOrDefaultAsync(x => x.Id == id);

            if (user == null) return NotFound();

            return user;
        }

        [HttpGet("filters")]
        public async Task<IActionResult> GetFilters()
        {
            var skills = await _userManager.Users.Select(u => u.Skill).Distinct().ToListAsync();
            var jobs = await _userManager.Users.Select(u => u.Job).Distinct().ToListAsync();

            return Ok(new { skills, jobs });
        }

        // [Authorize(Roles = "Admin")]
        [HttpPut]
        public async Task<ActionResult<User>> UpdateEmployee([FromForm]UpdateEmployeeDto employeeDto)
        {
            var user = await _userManager.Users
                .FirstOrDefaultAsync(x => x.UserName == employeeDto.UserName);

            if (user == null) return NotFound();

            user.Skill = employeeDto.Skill;
            user.Job = employeeDto.Job;

            var result = await _context.SaveChangesAsync() > 0;

            if (result) return Ok(user);

            return BadRequest(new ProblemDetails { Title = "Problem updating employee" });
        }
    }
}