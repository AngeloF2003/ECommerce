namespace ECommerce.API.Models
{
    public enum RoleType
    {
        Admin = 1,
        User = 2
    }
    public class Role
    {
        public int IdRole { get; set; }
        public RoleType  Cargo { get; set; }
    }
}
