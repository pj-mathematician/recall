import openai
import os

def transcribe(audio_file_path):
    openai.api_type = "open_ai"
    openai.api_version = None
    openai.api_base = "https://api.openai.com/v1"
    openai.api_key = os.environ.get("OPENAI_API_KEY_oai")
    openai.organization = os.environ.get("OPENAI_ORG")
    with open(audio_file_path, "rb") as f:
        # file_bytes = f.read()
        # get the filetpe from the path
        file_type = audio_file_path.split(".")[-1]
        transcript = openai.Audio.transcribe("whisper-1", f, response_format = 'verbose_json')
    return transcript
