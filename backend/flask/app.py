from flask import Flask
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from config import Config
from database import db
from routes import auth

app = Flask(__name__)

app.config.from_object(Config)

db.init_app(app)

bcrypt = Bcrypt(app)

CORS(
    app,
    resources={r"/*": {"origins": "*"}},
    methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"]
)

app.register_blueprint(auth)

with app.app_context():
    db.create_all()


@app.route("/")
def home():
    return {
        "message": "Attendance Management System API is Running"
    }


if __name__ == "__main__":
    app.run(debug=True)