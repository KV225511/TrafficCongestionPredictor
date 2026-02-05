import pickle
with open('ml/model.pkl','rb') as m:
    model=pickle.load(m)
    
with open('ml/encoders.pkl','rb') as e:
    encoders=pickle.load(e)
    
print(encoders)
print(model)
    