using API.Models;
using API.Services;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ShipsController : ControllerBase
    {
        private readonly ShipService _shipService;

        public ShipsController(ShipService shipService)
        {
            _shipService = shipService;
        }

        [HttpGet]
        public ActionResult<List<Ship>> Get() =>
            _shipService.Get();

        [HttpGet("{id:length(24)}", Name = "GetShip")]
        public ActionResult<Ship> Get(string id)
        {
            var ship = _shipService.Get(id);

            if (ship == null)
            {
                return NotFound();
            }

            return ship;
        }

        [HttpPost]
        public ActionResult<Ship> Create(Ship ship)
        {
            _shipService.Create(ship);

            return CreatedAtRoute("GetShip", new { id = ship.Id.ToString() }, ship);
        }

        [HttpPut("{id:length(24)}")]
        public IActionResult Update(string id, Ship shipIn)
        {
            var ship = _shipService.Get(id);

            if (ship == null)
            {
                return NotFound();
            }

            _shipService.Update(id, shipIn);

            return NoContent();
        }

        [HttpDelete("{id:length(24)}")]
        public IActionResult Delete(string id)
        {
            var ship = _shipService.Get(id);

            if (ship == null)
            {
                return NotFound();
            }

            _shipService.Remove(ship.Id);

            return NoContent();
        }
    }
}
