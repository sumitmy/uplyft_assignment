from flask import Flask, request, jsonify
from flask_cors import CORS
from sqlalchemy import create_engine, Column, Integer, String, Float
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import random
import jwt
import datetime

app = Flask(__name__)
CORS(app)

# Database setup
engine = create_engine('sqlite:///ecommerce.db')
Base = declarative_base()

class Product(Base):
    __tablename__ = 'products'
    id = Column(Integer, primary_key=True)
    name = Column(String)
    category = Column(String)
    price = Column(Float)
    stock = Column(Integer)

class ChatInteraction(Base):
    __tablename__ = 'chat_interactions'
    id = Column(Integer, primary_key=True)
    user_message = Column(String)
    bot_response = Column(String)
    timestamp = Column(String)

Base.metadata.create_all(engine)
Session = sessionmaker(bind=engine)
session = Session()

# Mock Data Initialization
def init_mock_data():
    if not session.query(Product).first():
        product_names = [
            "Smartphone", "Laptop", "Tablet", "Headphones", "Smartwatch", "Camera", "Television",
            "Monitor", "Keyboard", "Mouse", "Router", "Printer", "Chair", "Desk", "Lamp",
            "Backpack", "Shoes", "T-shirt", "Jeans", "Jacket", "Book", "Magazine", "Pen", "Notebook",
            "Bicycle", "Helmet", "Treadmill", "Blender", "Mixer", "Cooker"
        ]
        categories = ["Electronics", "Books", "Clothing", "Fitness", "Furniture", "Kitchen"]
        price_range = [(10, 50), (100, 500), (500, 1000), (1000, 2000)]
        stock_range = (10, 100)

        mock_products = [
            Product(
                name=random.choice(product_names),
                category=random.choice(categories),
                price=round(random.uniform(*random.choice(price_range)), 2),
                stock=random.randint(*stock_range)
            )
            for _ in range(100)
        ]
        session.add_all(mock_products)
        session.commit()

    if not session.query(ChatInteraction).first():
        session.add(ChatInteraction(user_message="", bot_response="", timestamp=""))
        session.commit()

init_mock_data()

@app.route('/api/products', methods=['GET'])
def get_products():
    category = request.args.get('category')
    price_min = request.args.get('price_min', type=float)
    price_max = request.args.get('price_max', type=float)

    query = session.query(Product)

    if category:
        query = query.filter(Product.category.ilike(f"%{category}%"))
    if price_min is not None:
        query = query.filter(Product.price >= price_min)
    if price_max is not None:
        query = query.filter(Product.price <= price_max)

    products = query.all()
    result = [
        {"id": p.id, "name": p.name, "category": p.category, "price": p.price, "stock": p.stock}
        for p in products
    ]
    return jsonify(result)

@app.route('/api/products/chatbot', methods=['POST'])
def chatbot_response():
    user_message = request.json.get('message', '').lower()
    timestamp = datetime.datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S')
    response = ""

    if "electronics" in user_message:
        response = "You can find products like Smartphones, Laptops, and more in the Electronics category."
    elif "books" in user_message:
        response = "We have a wide range of Books and Magazines available."
    else:
        response = "Sorry, I didn't understand that. Can you specify a category or product?"

    chat_interaction = ChatInteraction(
        user_message=user_message,
        bot_response=response,
        timestamp=timestamp
    )
    session.add(chat_interaction)
    session.commit()

    return jsonify({"response": response})

@app.route('/api/login', methods=['POST'])
def login():
    username = request.json.get('username')
    password = request.json.get('password')

    # username=admin and password=admin@123 for login
    if username == "admin" and password == "admin@123":
        token = jwt.encode({
            'sub': username,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1)
        }, 'secret', algorithm='HS256')
        return jsonify({'token': token})
    return jsonify({"message": "Invalid credentials"}), 401

@app.route('/api/chat_history', methods=['GET'])
def get_chat_history():
    interactions = session.query(ChatInteraction).all()
    result = [
        {"id": i.id, "user_message": i.user_message, "bot_response": i.bot_response, "timestamp": i.timestamp}
        for i in interactions
    ]
    return jsonify(result)

@app.route('/api/protected', methods=['GET'])
def protected_route():
    token = request.headers.get('Authorization', '').replace('Bearer ', '')
    try:
        jwt.decode(token, 'secret', algorithms=['HS256'])
        return jsonify({"message": "Access granted"})
    except jwt.ExpiredSignatureError:
        return jsonify({"message": "Token expired"}), 401
    except jwt.InvalidTokenError:
        return jsonify({"message": "Invalid token"}), 401

if __name__ == '__main__':
    app.run(debug=True)
