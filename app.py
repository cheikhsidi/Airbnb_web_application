from flask import jsonify
from flask import Flask, redirect, render_template
# from flask_pymongo import PyMongo
import pymongo
from pymongo import MongoClient
from bson.json_util import dumps
import json
# from mongoengine import connect

app = Flask(__name__)


# Use flask_pymongo to set up mongo connection
# client = MongoClient(
#     "mongodb+srv://analytics:analytics.password@cluster0-g8thv.mongodb.net/test?retryWrites=true&w=majority")
# client = MongoClient(
#         "mongodb+srv://analytics:analytics.password@cluster0-g8thv.mongodb.net/test?retryWrites=true&w=majority")
# db = client["aibnb_nyc"]
# collection = db["collection"]
# collection1 = db["collection1"]

# Create connection variable
conn = "mongodb://localhost:27017"

# Pass connection to the pymongo instance.
client1 = pymongo.MongoClient(conn)

# Connect to a database. Will create one if not already available.
db1 = client1.airbnb_nyc

# create route that renders index.html template
@app.route("/")
def index():

    return render_template("index.html")

@app.route("/data/<borough>")
def getdata(borough):
    print("call getdata")
    location = {}
    query = db1.data.find({"neighbourhood_group_cleansed":borough}).limit(1)
    print(query)
    for d in query:
        location["location"] = d["Location"]
        location["borouhs"] = d["neighbourhood_group_cleansed"]
    print("loop complete")
    coor = location
    print(type(location))
    print(location)   
    # print(f"python :{coor}")
    return render_template("index.html", coor=location)
    #  latLong = [airbnb_data.latitude, aibnb_data.longitude]


# @app.route("/data/<borough>")
# def data(borough):
#     """Return the homepage."""

#     lat = []
#     lon = []
#     airbnb_data = mongo.db.data.find({"Borough":borough})
#     for document in airbnb_data:
#         lat.append(document["latitude"])
#         lon.append(document["longitude"])
#     #  lat = airbnb_data.find({}, {"latitude": 1, "_id": 0})
#     #  lon = airbnb_data.find({}, {"longitude": 1, "_id": 0})
#     #  airbnb_data.aggregate([
#     #      {"$project": {"coordinates": ["$latitude", "$longitude"]}}
#     return render_template("index.html")


# @app.route("/names")
# def names():
#     """Return a list of sample names."""

#     # Use Pandas to perform the sql query
#     stmt = db.session.query(Samples).statement
#     df = pd.read_sql_query(stmt, db.session.bind)

#     # Return a list of the column names (sample names)
#     return jsonify(list(df.columns)[2:])


# @app.route("/dat/<sample>")
# def sample_metadata(sample):
#     """Return the MetaData for a given sample."""
#     results = db.session.query(
#         *sel).filter(data.sample == sample).sort({Employeeid: -1}).limit(10)

#     # Create a dictionary entry for each row of metadata information
#     sample_metadata = {}
#     for result in results:
#         sample_metadata["Top 1"] = result[0]
#         sample_metadata["Top 2"] = result[1]
#         sample_metadata["Top 3"] = result[2]
#         sample_metadata["Top 4"] = result[3]
#         sample_metadata["Top 5"] = result[4]

#     print(sample_metadata)
#     return jsonify(sample_metadata)


# @app.route("/features/<sample>")
# def samples(sample):
#     """Return `Latitude`, `Longitude`,and `price`."""
#     stmt = db.session.query(Samples).statement
#     df = pd.read_sql_query(stmt, db.session.bind)

#     # Filter the data based on the sample number and
#     # only keep rows with values above 1
#     sample_data = df.loc[df[sample] > 1, ["latitude", "longitude", sample]]
#     # Format the data to send as json
#     data = {
#         "otu_ids": sample_data.otu_id.values.tolist(),
#         "sample_values": sample_data[sample].values.tolist(),
#         "otu_labels": sample_data.otu_label.tolist(),
#     }
#     return jsonify(data)


# if __name__ == "__main__":
#     # Bind to PORT if defined, otherwise default to 5000.
#     port = int(os.environ.get("PORT", 5000))
#     app.run(host="0.0.0.0", port=port)
#     # app.run()


if __name__ == "__main__":
    app.run(debug=True)
