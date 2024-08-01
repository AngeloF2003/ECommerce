using ECommerce.API.DataAccess;
using ECommerce.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

namespace ECommerce.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductCrudController : ControllerBase
    {
        readonly IDataAccess dataAccess;
        private readonly string DateFormat;
        public ProductCrudController(IDataAccess dataAccess, IConfiguration configuration)
        {
            this.dataAccess = dataAccess;
            DateFormat = configuration["Constants:DateFormat"];
        }

        [HttpGet("ListAll")]
        public ActionResult<IEnumerable<Product>> GetAllProducts()
        {
            var products = dataAccess.GetAllProducts();
            return Ok(products);
        }

        [HttpGet("ProductRead/{id}")]
        public ActionResult<Product> GetProduct(int id)
        {
            var product = dataAccess.GetProduct(id);
            if (product == null)
            {
                return NotFound();
            }
            return Ok(product);
        }

        [HttpPost("Insert")]
        
        public ActionResult<int> InsertProduct(Product product)
        {
            var productId = dataAccess.InsertProduct(product);
            return CreatedAtAction(nameof(GetProduct), new { id = productId }, productId);
        }

        [HttpPut("Update/{id}")]
       
        public IActionResult UpdateProduct(int id, Product product)
        {
            if (id != product.Id)
            {
                return BadRequest();
            }

            dataAccess.UpdateProduct(product);
            return NoContent();
        }

        [HttpDelete("Delete/{id}")]
       
        public IActionResult DeleteProduct(int id)
        {
            dataAccess.DeleteProduct(id);
            return NoContent();
        }
    }
}
