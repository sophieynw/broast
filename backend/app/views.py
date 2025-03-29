import json
import os
from flask import Blueprint, jsonify
from flask_login import login_required

views = Blueprint("views", __name__)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))  # Base directory of this file
CACHE_DIR = os.path.join(BASE_DIR, "../../frontend/src/assets/cache")

@views.route("/")
def root():
    return jsonify({"message": "Welcome to the BRoast API!"})

@views.route("/api/home")
@login_required
def home():
    return jsonify({"message": "This is the Home page API."})

@views.route("/api/about")
@login_required
def about():
    return jsonify({"message": "This is the About page API."})