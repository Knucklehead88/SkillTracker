using System.Runtime.CompilerServices;

namespace API.Extensions
{
    public static class StringExtension
    {
        public static bool IsNotNullOrEmpty(this string text)
        {
            return !(string.IsNullOrWhiteSpace(text) && string.IsNullOrEmpty(text));
        }
    }
}
