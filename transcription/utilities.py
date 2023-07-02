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
        transcript = openai.Audio.transcribe("whisper-1", f, response_format = 'srt')
    return transcript

def translate(output_language, text):
    openai.api_type = 'azure'
    openai.api_version = "2023-03-15-preview"
    openai.api_key = os.environ.get("OPENAI_API_KEY_AZURE")
    openai.api_base = os.environ.get("OPENAI_API_KEY_BASE")
    SYSTEM_PROMPT = "You are a translator"
    USER_PROMPT = f"Translate to {output_language}:\n{text}"
    messages = []
    messages.append({"role":'system', 'content':SYSTEM_PROMPT})
    messages.append({"role":'user', 'content':USER_PROMPT})
    response = openai.ChatCompletion.create(
        engine='gen',
        messages=messages,
        temperature=0.0001,
        request_timeout=120
    )
    return response.choices[0]['message']['content']

def get_embedding(text, model="emb-gen"):
   text = text.replace("\n", " ")
   openai.api_type = 'azure'
   openai.api_version = "2023-03-15-preview"
   openai.api_key = os.environ.get("OPENAI_API_KEY_AZURE")
   openai.api_base = os.environ.get("OPENAI_API_KEY_BASE")
   return np.array(openai.Embedding.create(input = [text], engine=model)['data'][0]['embedding'])
