using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Models
{
    public class Ship
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }
        public int mmsi { get; set; }
        public double length { get; set; }
        public double width { get; set; }
        public string flag { get; set; }
        public string image { get; set; }
    }
}
