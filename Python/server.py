from flask import Flask, request, jsonify, json
import tensorflow as tf
import urllib.parse
from matplotlib.image import imread
import math
import os
import flask_cors

app = Flask(__name__)
flask_cors.CORS(app)

loaded_model = tf.keras.models.load_model(
    os.path.join(os.path.dirname(__file__), "image_model")
)

with open(
    os.path.join(os.path.dirname(__file__), "image_info.json"), "r"
) as image_info:
    image_info = json.load(image_info)


@app.route("/api/predict", methods=["POST"])
def index():
    url = urllib.parse.unquote(request.json["image"])
    test_image = imread(url)
    test_image = test_image.reshape((1, 256, 256, 3))
    results = (loaded_model.predict(test_image) * 100).tolist()[0]

    first_highest_percent = max(results)
    first_highest = results.index(first_highest_percent)
    results[first_highest] = -1
    second_highest_percent = max(results)
    second_highest = results.index(second_highest_percent)

    map_first = image_info["map"][first_highest]
    map_second = image_info["map"][second_highest]

    category_first = (
        image_info["category"][map_first[0]]["name"]
        + " "
        + image_info["category"][map_first[0]]["diseases"][map_first[1]]["name"]
    )
    category_second = (
        image_info["category"][map_second[0]]["name"]
        + " "
        + image_info["category"][map_second[0]]["diseases"][map_second[1]]["name"]
    )

    return (
        {
            "results": 2,
            "status": "success",
            "data": {
                "predictions": [
                    {"name": category_first, "percent": first_highest_percent},
                    {"name": category_second, "percent": second_highest_percent},
                ]
            },
        },
        200,
        {"Content-Type": "application/json", "Allow-Control-Allow-Origin": "*"},
    )


with open(
    os.path.join(os.path.dirname(__file__), "history.json"), "r"
) as model_history:
    model_history = json.load(model_history)

with open(
    os.path.join(os.path.dirname(__file__), "image_info.json"), "r"
) as image_info:
    image_info = json.load(image_info)

with open(
    os.path.join(os.path.dirname(__file__), "test_results.json"), "r"
) as test_results:
    test_results = json.load(test_results)


@app.route("/api/stats", methods=["GET"])
def imageStats():
    return (
        {
            "status": "success",
            "data": {
                "training_stats": model_history,
                "image_stats": image_info,
                "test_results": test_results,
            },
        },
        200,
        {"Content-Type": "application/json", "Allow-Control-Allow-Origin": "*"},
    )


app.run(port=3002, debug=True)
