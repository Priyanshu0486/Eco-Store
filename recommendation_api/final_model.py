from collaborative import Collaborative_Recommender
from contentbased import Content_based_recommender
import pickle

content_based=Content_based_recommender()
collaborative=Collaborative_Recommender()

def final_model(product_id):
    products=[]
    content_products=content_based.recommend_content_based(product_id)
    collaborative_products=collaborative.collaborative_recommender(product_id)
    products.append(content_products)
    products.append(collaborative_products)
    return products
pickle.dump(final_model, open("model.pkl", "wb"))
