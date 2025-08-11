import numpy as np
import pickle

df=pickle.load(open('pkl/clean_data.pkl','rb'))
pt=pickle.load(open('pkl/pt.pkl','rb'))

similarity_scores=pickle.load(open('pkl/similarity_scores.pkl','rb'))


class Collaborative_Recommender():
    def __init__(self):
        pass
    def collaborative_recommender(self,product_id):
        product_list=[]
        item_name=df[df['product_id'] == product_id]['product_name'].iloc[0]
        index=np.where(pt.index==item_name)[0][0]
        p_category=df[df['product_name'] == item_name]['category'].iloc[0].split()[0:2]
        distance=similarity_scores[index]
        similar_items= sorted(list(enumerate(distance)),key=lambda x:x[1],reverse=True )[1:100]
        for i in similar_items:
            name=pt.index[i[0]]
            prod_id= df[df['product_name'] == name]['product_id'].iloc[0]
            if p_category== df[df['product_name'] == name]['category'].iloc[0].split()[0:2]:
                product_list.append(prod_id)
        return product_list[0:21]
c=Collaborative_Recommender()