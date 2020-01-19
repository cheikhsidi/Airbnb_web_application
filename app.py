#Importing Dependencies
from flask import jsonify, Response
from flask import Flask, redirect, render_template
from flask_sqlalchemy import SQLAlchemy
import sqlalchemy
import pandas as pd
import numpy as np
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func, distinct
from api_key import password 
import json

from flask import Flask, jsonify


#################################################
# Flask Setup
#################################################

app = Flask(__name__)


#################################################
# Database Setup
#################################################
URI = f'postgresql://postgres:{password}@localhost:5432/airbnb_db'
app.config["SQLALCHEMY_DATABASE_URI"] = URI
db = SQLAlchemy(app)

# reflect an existing database into a new model
Base = automap_base()
# reflect the tables
Base.prepare(db.engine, reflect=True)

# Save reference to the table
# Measurement = Base.classes.measurement
data = Base.classes.airbnNYC_data


# Home Route
@app.route("/")
@app.route("/home")
def index():
    return render_template("index.html")

# About Page Route
@app.route("/about")
def about():
    return render_template("about.html")

# Data Set Route
@app.route("/datasets")
def DataRoutes():
    """Return a JSON list of dataset Routes"""
    return '/borough\n'\
            '/RoomT\n'\
            '/boroughP/<Room>\n'\
            '/listing/<borough>\n'\
            '/Room/<borough>\n'\
  
# # Drop Dwon List of Boroughs 
@app.route("/borough")
def borough():
    """Return a JSON Borough Dropdown list"""
     
    # Use Pandas to perform the sql query
    neib_list = db.session.query(distinct(data.Borough).label('dis')).statement
    df = pd.read_sql_query(neib_list, db.session.bind)
    d = df.to_dict('list')
    return json.dumps(d)

# Room Type Drop down list route
@app.route("/RoomT")
def Room():
    """Return a JSON RoomType Dropdown list"""

    # Use Pandas to perform the sql query
    neib_list = db.session.query(distinct(data.Room_Type).label('room')).statement
    df = pd.read_sql_query(neib_list, db.session.bind)
    df['room'] = [d.replace('/', '-') for d in df['room']]
    d = df.to_dict('list')
    return json.dumps(d)

# Avg price of Room type per borough
@app.route("/boroughP/<Room>")
def boroughP(Room):
    """Return a JSON neighbourhood Dropdown list"""

    # Use Pandas to perform the sql query
    neib_list = db.session.query(data.Borough, data.Room_Type, data.Price).statement
    df = pd.read_sql_query(neib_list, db.session.bind)
    df['Room_Type'] = [d.replace('/', '-') for d in df['Room_Type']]
    df = df[df['Room_Type'] == Room]
    df1 = df.groupby('Borough').count().reset_index()
    df2 = df.groupby('Borough').mean().reset_index().round(2)
    df = pd.merge(df1, df2, on='Borough')
    df = df[['Borough', 'Price_x', 'Price_y']].rename(
    columns={'Price_x': 'Count', 'Price_y': 'Price'})
    df['Percent'] = round((df.Count/df.Count.sum())*100, 2)
    d = df.to_dict('records')
    return json.dumps(d)

# Listing Route
@app.route("/listing/<borough>")
def lising(borough):
    """Return a JSON neighbourhood Listing dataset per neighbourhood"""
    # Use Pandas to perform the sql query
    neib_list = db.session.query(data.Borough,
                                data.neighbourhood_cleansed, data.id, data.number_of_reviews, data.Price).statement
    df = pd.read_sql_query(neib_list, db.session.bind)
    df = df[df['Borough'] == borough]
    df2 = df.groupby('neighbourhood_cleansed').count().reset_index()
    df1 = df.groupby('neighbourhood_cleansed').sum().reset_index()
    df3 = df.groupby('neighbourhood_cleansed').mean().reset_index().round(2)
    df = pd.merge(df1, df2, on='neighbourhood_cleansed')
    df = pd.merge(df, df3, on='neighbourhood_cleansed')
    df = df[['neighbourhood_cleansed', 'id_y', 'number_of_reviews_x', 'Price']].rename(
        columns={'id_y': 'Count', 'neighbourhood_cleansed': 'neighbourhood',  'number_of_reviews_x':'Reviews'})

    d = df.to_dict('records')
    return json.dumps(d)


# # Room Type Route
@app.route("/Room/<borough>")
def getRoom(borough):
    """Return a JSON dataset for property type of airbnb listing"""
    prpt = db.session.query(data.Borough, 
                            data.Room_Type, data.Price, data.Review_Rating, data.review_scores_cleanliness,
                            data.review_scores_value, data.host_response_rate).statement
    df = pd.read_sql_query(prpt, db.session.bind)
    df = df[df['Borough'] == borough]
    df["host_response_rate"] = df["host_response_rate"].str.replace("%", "").astype(float)
    df["review_scores_cleanliness"] = df["review_scores_cleanliness"].str.replace(".", "").astype(float)
    df["review_scores_value"] = df["review_scores_value"].str.replace(".", "").astype(float)
    df1 = df.groupby('Room_Type').count().reset_index()
    df2 = df.groupby('Room_Type').mean().reset_index().round(2)
    df = pd.merge(df1, df2, on='Room_Type')
    df = df[['Room_Type', 'Borough', 'Price_y', 'Review_Rating_y', 'review_scores_cleanliness_y', 'review_scores_value_y', 'host_response_rate_y']].rename(
    columns={'Price_y': 'Avg_price', 'Review_Rating_y':'RRate', 'review_scores_cleanliness_y':'RClean', 'review_scores_value_y':'RValue', 'host_response_rate_y':'HostResponseR' })
    df['percent'] = round((df.Borough/df.Borough.sum())*100, 2)
    d = df.to_dict('records')

    return json.dumps(d)

# Avg Price per borough route
@app.route("/price/<Borough>")
def price(Borough):
    """Return a list of sample names."""
    avlb = db.session.query(data.Price, data.neighbourhood_cleansed,
                            data.Borough).statement

    df = pd.read_sql_query(avlb, db.session.bind)
    df = df[df['Borough'] == Borough]
    df_price = pd.crosstab(df.Price, df.neighbourhood_cleansed)
    d = df_price.to_dict('list')
    print(len(d))
    return json.dumps(d)

# # Average Revirw rating
# @app.route("/Room/<borough>")
# def getRoom(borough):
#     """Return a JSON dataset for property type of airbnb listing"""
#     prpt = db.session.query(data.Borough,
#                             data.Room_Type, data.Price).statement
#     df = pd.read_sql_query(prpt, db.session.bind)
#     df = df[df['Borough'] == borough]
#     df1 = df.groupby('Room_Type').count().reset_index()
#     df2 = df.groupby('Room_Type').mean().reset_index().round(2)
#     df = pd.merge(df1, df2, on='Room_Type')
#     df = df[['Room_Type', 'Borough', 'Price_y']].rename(
#         columns={'Price_y': 'Avg_price'})
#     df['percent'] = round((df.Borough/df.Borough.sum())*100, 2)
#     d = df.to_dict('records')
#     print(len(d))
#     return json.dumps(d)


if __name__ == "__main__":
    app.run(debug=True)
