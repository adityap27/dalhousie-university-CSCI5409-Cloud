from flask import Flask
from flask import request
import mysql.connector

app = Flask(__name__)

mydb = mysql.connector.connect(
  host="cloud-a2-rds-1.cnik4a84ogb8.us-east-1.rds.amazonaws.com",
  user="admin",
  password="password", 
  database="cloud_a2"
)

@app.route("/store-products", methods=['POST'])
def store_products():
	try:
		request_json = request.json

		cursor = mydb.cursor()
		val = []

		for product in request_json["products"]:
			val.append((product["name"],product["price"],product["availability"]))
		
		cursor.executemany("INSERT INTO products (name, price, availability) VALUES (%s, %s, %s)", val)
		mydb.commit()
		cursor.close()
		return {
				"message": "Success."
			}, 200

	except Exception:
		return {
				"error": "Insertion failed. Something went wrong!"
			}, 400


@app.route("/list-products", methods=['GET'])
def list_products():

	try:
		cursor = mydb.cursor()
		cursor.execute("SELECT * FROM products")
		products = cursor.fetchall()

		response = {"products": [] }

		i = 0 
		for product in products:
			temp = {"name": product[0], "price": product[1], "availability": bool(product[2])}
			response["products"].append(temp)
			i+=1
		cursor.close()
		return response, 200
		
	except Exception:
		return {
				"error": "Listing failed. Something went wrong!"
			}, 400


if __name__ == "__main__":
	app.run("0.0.0.0", 80, debug=True)