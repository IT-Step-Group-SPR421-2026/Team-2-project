using Microsoft.AspNetCore.Http;
using Microsoft.VisualBasic.FileIO;

namespace TestingPlatform.BLL.Services.Storage
{
    public class StorageServise : IStorageServise
    {
        public async Task<string?> SaveImageFileAsync(IFormFile imageFile, string folderPath)
        {
            var types = imageFile.ContentType.Split("/");

            if (types.Length != 2 || types[0] != "image")
            {
                return null;
            }

            string extenstion = Path.GetExtension(imageFile.FileName);
            string fileName = $"{Guid.NewGuid().ToString()}{extenstion}";
            string filePath = Path.Combine(folderPath, fileName);

            using (var fileStream = File.Create(filePath))
            {
                await imageFile.CopyToAsync(fileStream);
            }

            return fileName;
        }
    }
}
