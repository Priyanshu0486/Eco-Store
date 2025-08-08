import pickle

with open("pkl/products.pkl", 'rb') as file:
    products = pickle.load(file)

with open("pkl/similarity_score.pkl", 'rb') as file:
    similarity = pickle.load(file)

class Content_based_recommender:
    def recommend_content_based(self,product_id):
        result = []
        try:
            product_name = list(products[products['product_id'] == product_id]['product_name'])[0]
            product_index = products[products['product_name'] == product_name].index[0]
        except:
            return []
        else:
            for i in sorted(list(enumerate(similarity[product_index])), reverse=True, key=lambda x: x[1])[1:21]:
                result.append(products.iloc[i[0]]['product_id'])

        return result
