using System.Net;

namespace TestingPlatform.BLL.Services
{
    public class ServiceResponse
    {
        public string Message { get; set; } = string.Empty;
        public bool IsSuccess { get; set; } = true;
        public object? Payload { get; set; } = null;
        public HttpStatusCode StatusCode { get; set; } = HttpStatusCode.OK;
    }
}
