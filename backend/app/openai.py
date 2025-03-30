import os
import re
import json

import openai
import requests
import PyPDF2
from dotenv import load_dotenv
from docx import Document
from flask import Blueprint, request, jsonify

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CACHE_DIR = os.path.abspath(os.path.join(BASE_DIR, "..", "..", "frontend", "src", "assets", "cache"))
KEY_PATH = os.path.join(BASE_DIR, ".env")

load_dotenv(dotenv_path=KEY_PATH)
openai.api_key = os.getenv("GPT_API_KEY")  # Ensure this environment variable exists
PERPLEXITY_API_KEY = os.getenv("PERPLEXITY_API_KEY")

openAI = Blueprint("openAI", __name__)

# Functions for extracting text
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

# Add function to query Perplexity API
def get_perplexity_job_recommendations(dream_job, document_type, document_text):
    """Get job recommendations from Perplexity API"""
    try:
        url = "https://api.perplexity.ai/chat/completions"
        headers = {
            "Authorization": "Bearer " + PERPLEXITY_API_KEY,
            "Content-Type": "application/json"
        }

        system_message = """
        You're a Gen Z career coach who's sarcastic, supportive, and savage when needed. 
        Your tone should be TikTok-style: witty, snappy, emoji-filled, and Gen Z-flavored. 
        Keep it short and punchy. Be playful but never mean.
        """

        user_message = f"""
        My dream job is {dream_job} and my {document_type} data is below. 
        Find live job postings from Indeed and include links. 

        - Include job title, a brief description, and a **direct link** to apply.
        - Format it in **markdown** with emojis.
        - Group by company or job type.

        {document_type.capitalize()}:
        {document_text}
        """

        response = requests.post(url, headers=headers, json={
            "model": "sonar",
            "messages": [
                {"role": "system", "content": system_message},
                {"role": "user", "content": user_message}
            ]
        })

        # Safely extract and return the response content
        response_json = response.json()
        return response_json["choices"][0]["message"]["content"]

    except Exception as e:
        print(f"Perplexity API error: {str(e)}")
        return f"**Job Recommendations Unavailable** 😔\n\nSorry, we couldn't get job recommendations right now. Try again later!"
    
# Routes
@openAI.route("/openai", methods=["GET"])
def openai_index():
    return jsonify({"message": "OpenAI API endpoint"}), 200

@openAI.route("/upload", methods=["POST"])
def upload():
    try:
        # Get inputs from the frontend
        dream_job = request.form.get("dreamJob", "").strip()
        selection = request.form.get("selectedOption", "").strip().lower()
        upload_file = request.files.get("file")
        
        # Validate inputs
        if not upload_file:
            return jsonify({"error": "No file uploaded"}), 400
        
        if not dream_job:
            return jsonify({"error": "Dream job is required"}), 400
            
        if selection not in ["resume", "coverletter"]:
            return jsonify({"error": "Invalid selection. Must be 'resume' or 'coverletter'"}), 400
        
        # Save and process the uploaded file
        filename = upload_file.filename
        file_path = os.path.join(CACHE_DIR, filename)
        os.makedirs(CACHE_DIR, exist_ok=True)
        upload_file.save(file_path)
        
        # Extract text from the file
        data = get_text_from_file(file_path)
        
        # Prepare the system message
        system_message = """
        You're a Gen Z career coach who's sarcastic, supportive, and savage when needed. 
        Your tone should be TikTok-style: witty, snappy, emoji-filled, and Gen Z-flavored. 
        Keep it short and punchy. Be playful but never mean.
        """
        
        # Prepare the prompt based on selection and dream job
        document_type = "resume" if selection == "resume" else "cover letter"
        prompt = f"""
        Review this {document_type} for someone applying to be a {dream_job}. Respond in this format:

        1. ROAST (2-3 playful insults about how this {document_type} might not land the {dream_job} role)
        2. GLOW-UP TIPS (3 actionable suggestions to improve this {document_type} specifically for a {dream_job} position)
        3. COMPLIMENT (something nice & encouraging about their qualifications for {dream_job})

        Format it like this:
        - Use headings like **ROAST**, **GLOW-UP TIPS**, and **COMPLIMENT** with emojis.
        - Use numbered or bulleted lists.
        - Add relevant emojis to make it fun and energetic.

        {document_type.capitalize()}:
        """
        
        # Call the OpenAI API
        completion = openai.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": system_message},
                {"role": "user", "content": prompt + "\n\n" + data}
            ]
        )
        
        # Extract the response
        gpt_response = completion.choices[0].message.content
        
        # Get job recommendations from Perplexity
        job_recommendations = get_perplexity_job_recommendations(dream_job, document_type, data)
        
        # Combine responses with a clear separator
        combined_response = f"""
        {gpt_response}

        ---

        ## 🔥 JOB RECOMMENDATIONS FOR YOU 🔥

        {job_recommendations}
        """
        
        # Return success response with AI feedback
        return jsonify({
            "success": True,
            "response": combined_response,
            "dreamJob": dream_job,
            "documentType": document_type
        }), 200
        
    except ValueError as ve:
        # Handle specific file format errors
        return jsonify({"error": str(ve), "success": False}), 400
        
    except Exception as e:
        # Handle general errors
        print(f"Error processing upload: {str(e)}")
        return jsonify({"error": str(e), "success": False}), 500

@openAI.route("/test-perplexity", methods=["POST"])
def test_perplexity():
    try:
        dream_job = request.form.get("dreamJob", "").strip()
        document_type = request.form.get("documentType", "").strip().lower()
        text_input = request.form.get("documentText", "").strip()

        if not all([dream_job, document_type, text_input]):
            return jsonify({"error": "Missing required fields"}), 400

        result = get_perplexity_job_recommendations(dream_job, document_type, text_input)
        return jsonify({
            "success": True,
            "result": result
        }), 200

    except Exception as e:
        print(f"Perplexity API error: {str(e)}")  # already there — check terminal logs!
        return f"**Job Recommendations Unavailable** 😔\n\nSorry, we couldn't get job recommendations right now. Try again later!"