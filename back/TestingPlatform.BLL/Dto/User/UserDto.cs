using System.ComponentModel.DataAnnotations;
using TestingPlatform.DAL.Entities;

namespace TestingPlatform.BLL.Dto.User
{
    public class UserDto
    {
        public required string Id { get; set; }
        [Required(ErrorMessage = "Поле 'Name' є обов'язковим")]
        public required string Name { get; set; }
        [Required(ErrorMessage = "Поле 'Email' є обов'язковим")]
        public required string Email { get; set; }
        [Required(ErrorMessage = "Поле 'Role' є обов'язковим")]

        public SubscriptionStatus SubscriptionStatus { get; set; }
        public int TestLimit { get; set; }
        public Role Role { get; set; }
    }
}
