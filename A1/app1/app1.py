import os
import requests

# Reference: https://flask.palletsprojects.com/en/2.3.x/quickstart/
# I have used the basic bolierplate hello world code from flask quickstart guide. 
# Then I have modified with my own logic inside the function(calculate).

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
    if not os.path.isfile("./files/" + request.json["file"]):
        return {
            "file": request.json["file"],
            "error": "File not found."
            }


    # 3. Send the "file" and "product" parameters to container 2 and return response back.
    response = requests.post(url="http://app2_container:7000/sum",json=request.json, headers={'Content-Type': 'application/json'})
    return response.json()

if __name__ == "__main__":
    app.json.sort_keys = False
    app.run(host="0.0.0.0", port=6000)
