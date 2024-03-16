import os
import requests

# Reused my Assignment-1 code here.

from flask import Flask, request

app = Flask(__name__)

@app.route("/calculate", methods=["POST"])
def calculate():

    # 1. Validate input JSON to ensure file name was provided
    try:
        if request.json["file"] == None:
            return {
                    "file": None,
                    "error": "Invalid JSON input."
                }
    except KeyError:
        return {
                    "file": None,
                    "error": "Invalid JSON input."
            }

    # 2. Verify that file exists
    if not os.path.isfile("/Aditya_PV_dir/" + request.json["file"]):
        return {
            "file": request.json["file"],
            "error": "File not found."
            }


    # 3. Send the "file" and "product" parameters to container 2 and return response back.
    response = requests.post(url="http://app2-service/sum",json=request.json, headers={'Content-Type': 'application/json'})
    return response.json()

@app.route("/store-file", methods=["POST"])
def store_file():

    # 1. Validate input JSON to ensure file name was provided
    try:
        if request.json["file"] == None:
            return {
                    "file": None,
                    "error": "Invalid JSON input."
                }
    except KeyError:
        return {
                    "file": None,
                    "error": "Invalid JSON input."
            }

    # 2. Store the file.
    try:
        with open("/Aditya_PV_dir/" + request.json["file"], "w+") as csvfile:
            csvfile.write(request.json["data"].replace(" ", ""))

    except Exception as e:
        # 2.1 Send error response if there was exception.
        return {
                    "file": None,
                    "error": "Error while storing the file to the storage."
            }
    # 2.2 Send success response if there was no exception during creating/storing the file.
    return {
        "file": request.json["file"],
        "message": "Success."
    }


if __name__ == "__main__":
    app.json.sort_keys = False
    app.run(host="0.0.0.0", port=6000, debug=True)
