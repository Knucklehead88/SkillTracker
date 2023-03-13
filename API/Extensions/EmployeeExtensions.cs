using System.Collections.Generic;
using System.Linq;
using API.Entities;

namespace API.Extensions
{
    public static class UserExtensions
    {
        public static IQueryable<User> Sort(this IQueryable<User> query, string orderBy)
        {
            if (string.IsNullOrEmpty(orderBy)) return query.OrderBy(u => u.UserName); 

            query = orderBy switch
            {
                "skill" => query.OrderBy(u => u.Skill),
                "skillDesc" => query.OrderByDescending(p => p.Skill),
                _ => query.OrderBy(p => p.UserName)
            };

            return query;
        }

        public static IQueryable<User> Search(this IQueryable<User> query, string searchTerm)
        {
            if (string.IsNullOrEmpty(searchTerm)) return query;

            var lowerCaseSearchTerm = searchTerm.Trim().ToLower();

            return query.Where(p => p.UserName.ToLower().Contains(lowerCaseSearchTerm));
        }

        public static IQueryable<User> Filter(this IQueryable<User> query, string brands, string types)
        {
            var skillList = new List<string>();
            var typeList = new List<string>();

            if (!string.IsNullOrEmpty(brands))
                skillList.AddRange(brands.ToLower().Split(",").ToList());

            if (!string.IsNullOrEmpty(types))
                typeList.AddRange(types.ToLower().Split(",").ToList());

            query = query.Where(u => skillList.Count == 0 || skillList.Contains(u.Skill.ToLower()));
            query = query.Where(u => typeList.Count == 0 || typeList.Contains(u.Job.ToLower()));

            return query;
        }
    }
}