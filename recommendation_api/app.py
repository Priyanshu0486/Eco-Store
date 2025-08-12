from flask import Flask, request, jsonify
import pickle
from final_model import final_model 

app = Flask(__name__)

model = pickle.load(open("pkl/model.pkl", "rb"))

@app.route("/recommend", methods=["POST"])
def recommend():

    data = request.get_json()

    if not data or "prod_id" not in data:
        return jsonify({"error": "prod_id is required"}), 400

    prod_id = data["prod_id"]

    recs = []
    recs_content_based = final_model(prod_id)[0]
    recs_collborative_filtering = final_model(prod_id)[1]
    recs.append(recs_content_based)
    recs.append(recs_collborative_filtering)

    if not isinstance(recs, list):
        recs = list(recs)

    return jsonify({"recommendations": recs})

if __name__ == "__main__":
    app.run(debug=True)
