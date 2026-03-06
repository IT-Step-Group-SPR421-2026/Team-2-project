namespace TestingPlatform.BLL.Services.Translation
{
    public interface ITranslationService
    {
        Task<string> TranslateAsync(string text, string from = "uk", string to = "en");
        Task<T> TranslateObjectAsync<T>(T obj);
        Task<List<T>> TranslateRangeOfObjectsAsync<T>(List<T> objects);
    }
}
