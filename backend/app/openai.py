from datetime import datetime
import re
import openai
from flask import Blueprint, json, request, jsonify
from dotenv import load_dotenv
import os
from docx import Document
import PyPDF2

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CACHE_DIR = os.path.abspath(os.path.join(BASE_DIR, "..", "..", "frontend", "src", "assets", "cache"))
KEY_PATH = os.path.join(BASE_DIR, ".env")

# Load environment variables from .env
load_dotenv(dotenv_path=KEY_PATH)

# Set the OpenAI API key
openai.api_key = os.getenv("OPENAI_API_KEY")

# Define the Flask Blueprint
openAI = Blueprint("openAI", __name__)

# Define functions for extracting text
def extract_text_from_docx(file_path):
    doc = Document(file_path)
    return "\n".join([p.text for p in doc.paragraphs])

def extract_text_from_pdf(file_path):
    with open(file_path, 'rb') as f:
        reader = PyPDF2.PdfReader(f)
        return "\n".join([page.extract_text() for page in reader.pages])

def get_text_from_file(file_path):
    if file_path.endswith('.docx'):
        return extract_text_from_docx(file_path)
    elif file_path.endswith('.pdf'):
        return extract_text_from_pdf(file_path)
    else:
        raise ValueError("Unsupported file format")

# Routes
@openAI.route("/uploadresume", methods=["POST"])
def upload_resume():
  try:
    uploaded_file = request.files.get("resume")
    if not uploaded_file:
      return jsonify({"error": "No file uploaded"}), 400
    
    filename = uploaded_file.filename
    file_path = os.path.join(CACHE_DIR, filename)
    os.makedirs(CACHE_DIR, exist_ok=True)
    uploaded_file.save(file_path)

    data = get_text_from_file(file_path)

    prompt = """
    Review the resume below and respond in this format:

    1. ROAST (2-3 playful insults)
    2. GLOW-UP TIPS (3 actionable suggestions for improvement)
    3. COMPLIMENT (something nice & encouraging)

    Format it like this:
    - Use headings like **ROAST**, **GLOW-UP TIPS**, and **COMPLIMENT** with emojis.
    - Use numbered or bulleted lists.
    - Add relevant emojis to make it fun and energetic.

    Resume:
    """

    system_message = """
    You're a Gen Z career coach who's sarcastic, supportive, and savage when needed. 
    Your tone should be TikTok-style: witty, snappy, emoji-filled, and Gen Z-flavored. 
    Keep it short and punchy. Be playful but never mean.
    """

    completion = openai.chat.completions.create(
       model = "gpt-4o-mini",
       messages = [
          {"role": "system", "content": system_message},
          {"role": "user", "content": prompt + "\n\n" + data}
       ]
    )
    
    # Extract the response content
    ai_response = completion.choices[0].message.content
    
    # Return the response to the frontend
    return jsonify({
        "success": True,
        "response": ai_response
    })
    
  except Exception as e:
    return jsonify({"error": str(e)}), 500