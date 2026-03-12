using System.ComponentModel.DataAnnotations;
using TestingPlatform.DAL.Entities;

namespace TestingPlatform.BLL.Dto.Auth
{
    public class UpdateSubscriptionDto
    {
        [Required(ErrorMessage = "Поле 'UserId' є обов'язковим")]
        public required string UserId { get; set; }

        [Required(ErrorMessage = "Поле 'SubscriptionStatus' є обов'язковим")]
        public SubscriptionStatus SubscriptionStatus { get; set; }
    }
}
