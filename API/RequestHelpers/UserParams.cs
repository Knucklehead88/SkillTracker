namespace API.RequestHelpers
{
    public class UserParams : PaginationParams
    {
        public string? OrderBy { get; set; }
        public string? SearchTerm { get; set; }
        public string? Skills { get; set; }
        public string? Jobs { get; set; }
    }
}