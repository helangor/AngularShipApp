using API.Models;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Services
{
    public class ShipService
    {
        private readonly IMongoCollection<Ship> _ships;

        public ShipService(IShipsDatabaseSettings settings)
        {
            var client = new MongoClient(settings.ConnectionString);
            var database = client.GetDatabase(settings.DatabaseName);

            _ships = database.GetCollection<Ship>(settings.ShipsCollectionName);
        }

        public List<Ship> Get() =>
            _ships.Find(ship => true).ToList();

        public Ship Get(string id) =>
            _ships.Find<Ship>(ship => ship.Id == id).FirstOrDefault();

        public Ship GetWithMmsi(int mmsi) =>
            _ships.Find<Ship>(ship => ship.mmsi == mmsi).FirstOrDefault();

        public Ship Create(Ship ship)
        {
            _ships.InsertOne(ship);
            return ship;
        }

        public void Update(string id, Ship shipIn) =>
            _ships.ReplaceOne(ship => ship.Id == id, shipIn);

        public void Remove(Ship shipIn) =>
            _ships.DeleteOne(ship => ship.Id == shipIn.Id);

        public void Remove(string id) =>
            _ships.DeleteOne(ship => ship.Id == id);
    }
}
