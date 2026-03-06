
using System.Net.Http;
using System.Text.Json;

namespace TestingPlatform.BLL.Services.Translation
{
    public class TranslationService : ITranslationService
    {
        private readonly HttpClient _httpClient;

        public TranslationService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }
        public async Task<string> TranslateAsync(string text, string from = "uk", string to = "en")
        {
            var url = $"https://api.mymemory.translated.net/get?q={Uri.EscapeDataString(text)}&langpair={from}|{to}";
            var response = await _httpClient.GetStringAsync(url);

            using var doc = JsonDocument.Parse(response);
            return doc.RootElement
                .GetProperty("responseData")
                .GetProperty("translatedText")
                .GetString() ?? text;
        }
        public async Task<T> TranslateObjectAsync<T>(T obj)
        {
            var properties = typeof(T).GetProperties()
                .Where(p => p.PropertyType == typeof(string) && p.CanRead && p.CanWrite);

            foreach (var prop in properties)
            {
                var value = prop.GetValue(obj) as string;

                if (!string.IsNullOrEmpty(value))
                {
                    var translated = await TranslateAsync(value);
                    prop.SetValue(obj, translated);
                }
            }

            return obj;
        }
        public async Task<List<T>> TranslateRangeOfObjectsAsync<T>(List<T> objects)
        {
            foreach (var obj in objects)
            {
                await TranslateObjectAsync(obj);
            }
            return objects;
        }
    }
}
