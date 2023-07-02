import openai
import os
import numpy as np

def transcribe(audio_file_path, type = 'srt'):
    openai.api_type = "open_ai"
    openai.api_version = None
    openai.api_base = "https://api.openai.com/v1"
    openai.api_key = os.environ.get("OPENAI_API_KEY_oai")
    openai.organization = os.environ.get("OPENAI_ORG")
    with open(audio_file_path, "rb") as f:
        # file_bytes = f.read()
        # get the filetpe from the path
        file_type = audio_file_path.split(".")[-1]
        transcript = openai.Audio.transcribe("whisper-1", f, response_format = type)
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

def summarize_audio(audio_file_path):
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
    SYSTEM_PROMPT = "You are an SRT file summarizer"
    USER_PROMPT = f"Summarize the following SRT file:\n{transcript}"
    messages = []
    messages.append({"role":'system', 'content':SYSTEM_PROMPT})
    messages.append({"role":'user', 'content':USER_PROMPT})
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo-16k",
        messages=messages,
        temperature=0.3,
        request_timeout=500
    )
    return response.choices[0]['message']['content']

def summarize_text(text):
    openai.api_type = "open_ai"
    openai.api_version = None
    openai.api_base = "https://api.openai.com/v1"
    openai.api_key = os.environ.get("OPENAI_API_KEY_oai")
    openai.organization = os.environ.get("OPENAI_ORG")
    SYSTEM_PROMPT = "You are a text summarizer"
    USER_PROMPT = f"Summarize the following text:\n{text}"
    messages = []
    messages.append({"role":'system', 'content':SYSTEM_PROMPT})
    messages.append({"role":'user', 'content':USER_PROMPT})
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo-16k",
        messages=messages,
        temperature=0.3,
        request_timeout=500
    )
    return response.choices[0]['message']['content']

def sentiment_audio(audio_file_path):
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
    SYSTEM_PROMPT = """You are an SRT file sentiment analyzer. You have to classify the sentiment of the srt file as positive, negative or neutral. return the result in the form 
    {
        "sentiment": <>",
        "confidence": <>
        
    }"""
    USER_PROMPT = f"Analyse the sentiment of the following SRT file:\n{transcript}"
    messages = []
    messages.append({"role":'system', 'content':SYSTEM_PROMPT})
    messages.append({"role":'user', 'content':USER_PROMPT})
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo-16k",
        messages=messages,
        temperature=0.0001,
        request_timeout=500
    )
    return response.choices[0]['message']['content']

def sentiment_text(text):
    openai.api_type = "open_ai"
    openai.api_version = None
    openai.api_base = "https://api.openai.com/v1"
    openai.api_key = os.environ.get("OPENAI_API_KEY_oai")
    openai.organization = os.environ.get("OPENAI_ORG")
    SYSTEM_PROMPT = """You are a text sentiment analyzer. You have to classify (probabilities, between 0 and 1) the sentiment of the text as positive, negative or neutral. return the result in JSON like this
    {
        "positive": <>,
        "negative": <>,
        "neutral": <>
        
    }
    where <> is the confidence of the sentiment (float, between 0 and 1, 2 decimal places)"""

    USER_PROMPT = f"Analyse the sentiment of the following text:\n{text}"
    messages = []
    messages.append({"role":'system', 'content':SYSTEM_PROMPT})
    messages.append({"role":'user', 'content':USER_PROMPT})
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo-16k",
        messages=messages,
        temperature=0.00001,
        request_timeout=500
    )
    try:
        return eval(response.choices[0]['message']['content'])
    except:
        return response.choices[0]['message']['content']

def QnA(audio_file_paths, question):
    main_text = ""
    for audio_file_path in audio_file_paths:
        main_text += str(transcribe(audio_file_path, type = 'text'))
    SYSTEM_PROMPT = "You are a question answering system. You have to answer the questions asked by the user. Based on the following text:" + main_text
    USER_PROMPT = f"Question: {question}"
    messages = []
    messages.append({"role":'system', 'content':SYSTEM_PROMPT})
    messages.append({"role":'user', 'content':USER_PROMPT})
    openai.api_type = "open_ai"
    openai.api_version = None
    openai.api_base = "https://api.openai.com/v1"
    openai.api_key = os.environ.get("OPENAI_API_KEY_oai")
    openai.organization = os.environ.get("OPENAI_ORG")
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo-16k",
        messages=messages,
        temperature=0.01,
        request_timeout=500
    )
    return response.choices[0]['message']['content']

def QnA_text(texts, question):
    main_text = texts
    SYSTEM_PROMPT = "You are an SRT question answering system. You have to answer the questions asked by the user. You have to return the corresponding timestamp and the filename Based on the following text:" + main_text
    USER_PROMPT = f"Question: {question}"
    messages = []
    messages.append({"role":'system', 'content':SYSTEM_PROMPT})
    messages.append({"role":'user', 'content':USER_PROMPT})
    openai.api_type = "open_ai"
    openai.api_version = None
    openai.api_base = "https://api.openai.com/v1"
    openai.api_key = os.environ.get("OPENAI_API_KEY_oai")
    openai.organization = os.environ.get("OPENAI_ORG")
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo-16k",
        messages=messages,
        temperature=0.01,
        request_timeout=500
    )
    return response.choices[0]['message']['content']


def get_embedding(text, model="emb-gen"):
   text = text.replace("\n", " ")
   openai.api_type = "azure"
   openai.api_base = os.getenv("OPENAI_API_KEY_BASE")
   openai.api_version = "2023-03-15-preview"
   openai.api_key = os.getenv("OPENAI_API_KEY_AZURE")
   return np.array(openai.Embedding.create(input = [text], engine=model)['data'][0]['embedding'])
def search(audio_file_names, query):
    transcripts = [transcribe(i, type = 'srt').split("\n\n") for i in audio_file_names]
    # convert 2d list to 1d list
    transcript = [j for i in transcripts for j in i]
    audio_file_indexes = [i for i in range(len(audio_file_names)) for j in range(len(transcripts[i]))]
    embeddings = [get_embedding(i) for i in transcript]
    query_embedding = get_embedding(query)
    scores = [np.dot(query_embedding, i) for i in embeddings]
    answer = transcript[np.argmax(scores)]
    audio = audio_file_names[audio_file_indexes[np.argmax(scores)]]
    return answer, audio
