using Microsoft.AspNetCore.Http;

namespace TestingPlatform.BLL.Services.Storage
{
    public interface IStorageServise
    {
        Task<string?> SaveImageFileAsync(IFormFile imageFile, string folderPath);
    }
}
