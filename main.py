from fastapi import *
from typing import List, Optional
# from utils import *
from schema import *
from fastapi.openapi.utils import get_openapi
from transcription.utilities import *
from starlette.middleware import Middleware
from starlette.middleware.cors import CORSMiddleware

origins = [
    "*"
]
middleware = [
    Middleware(CORSMiddleware, allow_origins=origins)
]
app = FastAPI(debug = True, middleware=middleware)


@app.get("/", include_in_schema=False)
async def root():
    """
    Root endpoint
    """
    return {"message": "Use /docs"}


@app.get("/hello/{name}", include_in_schema=False)
async def say_hello(name: str):
    return {"message": f"Hello {name}"}

# POST /chat/ with r Request
@app.post("/chat/", include_in_schema=False)
async def chat(r: Request):
    data = await r.json()
    data = data["messages"]
    response = None
    if data[1]['user'] == 'Previous Year Cutoffs':
        if len(data) == 2:
            response = "Which state are you from? Delhi or Outside Delhi?"
        elif len(data) == 4:
            response = "Which category do you belong to? GN (General), OBC (OB), SC (SC), ST (ST), EWS (EW)?"
        elif len(data) == 6:
            response = "What is your JEE Mains rank?"
        elif len(data) == 8:
            state = data[3]['user']
            category = data[5]['user']
            rank = int(data[7]['user'])
            courses, ranks = get_streams(state, category, category, rank)
            response = f"Your rank is {rank} and you can get into {courses[0]} with a rank of {ranks[0]} in 2022, {courses[1]} with a rank of {ranks[1]} in 2021 and {courses[2]} with a rank of {ranks[2]} in 2020"
    else:
        response = "Only Previous Year Cutoffs are available right now"
    return {"message": response}

# POST /cutoff/ with r Request. It is a JSON with "state", "category", "subcategory" and "rank" as keys
@app.post("/cutoff/", include_in_schema=False)
async def cutoff(r: Request):
    try:
        data = await r.json()
        state = data["state"]
        category = data["category"]
        subcategory = data["subcategory"]
        rank = int(data["rank"])
        try:
            courses, ranks, campuses = get_streams_main(state, category, subcategory, rank)
            response = f"""Your rank is {rank} and your JAC category code is {category+subcategory+state[0]}.
    Based on the previous year JAC cutoffs, you can get admission in the following courses:
    {courses[0]} with a rank of {int(ranks[0])} in 2022
    {courses[1]} with a rank of {int(ranks[1])} in 2021
    {courses[2]} with a rank of {int(ranks[2])} in 2020"""
        except:
            courses, ranks, campuses = get_streams_main(state, 'GN', 'GN', rank)
            response = f"""Cutoffs for JAC category code is {category + subcategory + state[0]} are not available. Here are the cutoffs corresponding to GNGN{state[0]} category with rank {rank}.
    Based on the previous year JAC cutoffs, you can get admission in the following courses:
    {courses[0]} with a rank of {int(ranks[0])} in 2022
    {courses[1]} with a rank of {int(ranks[1])} in 2021
    {courses[2]} with a rank of {int(ranks[2])} in 2020"""
        # return {"message": response}
        courses = [str(i) for i in courses]
        ranks = [int(i) for i in ranks]
        campuses = [str(i) for i in campuses]
        return {
            "message": response,
            "JAC_category": category+subcategory+state[0],
            "courses": courses,
            "ranks": ranks,
            "campuses": campuses
        }
    except Exception as e:
        return {
            "error": "error"
        }

@app.post("/cutoff/stream/", include_in_schema=False)
async def cutoff_stream(r: Request):
    try:
        data = await r.json()
        state = data["state"]
        category = data["category"]
        subcategory = data["subcategory"]
        campus = data["campus"]
        stream = data["stream"]
        try:
            courses, ranks = get_choose_stream(campus, category, subcategory, state, stream)
        except:
            courses, ranks = get_choose_stream(campus, 'GN', 'GN', state, stream)
        return {
            "courses": courses["2022"],
            "ranks": ranks
        }
    except Exception as e:
        return {
            "error": "error"
        }


@app.post("/audio/transcribe/file/")
async def audio_transcribe(file: UploadFile = File(...), language: Optional[str] = "auto"):
    print(language)
    contents = await file.read()
    fname = file.filename
    fname = os.path.join(os.getcwd(), fname)
    with open(fname, "wb") as f:
        f.write(contents)
    trans_ = transcribe(fname)
    os.remove(fname)
    return trans_

@app.post("/audio/transcribe/multiple/")
async def audio_transcribe_multiple(files: List[UploadFile] = File(...)):
    f_contents = [await f.read() for f in files]
    fnames = [f.filename for f in files]
    fnames = [os.path.join(os.getcwd(), fname) for fname in fnames]
    transcriptions = []
    for i in range(len(fnames)):
        with open(fnames[i], 'wb') as f:
            f.write(f_contents[i])
        transcriptions.append(transcribe(fnames[i]))
        os.remove(fnames[i])
    return transcriptions

@app.post("/audio/summary/")
async def audio_summary(file: UploadFile = File(...)):
    contents = await file.read()
    fname = file.filename
    fname = os.path.join(os.getcwd(), fname)
    with open(fname, "wb") as f:
        f.write(contents)
    summary = summarize_audio(fname)
    os.remove(fname)
    return summary

@app.post("/audio/sentiment/")
async def audio_summary(file: UploadFile = File(...)):
    contents = await file.read()
    fname = file.filename
    fname = os.path.join(os.getcwd(), fname)
    with open(fname, "wb") as f:
        f.write(contents)
    sentiment = sentiment_audio(fname)
    os.remove(fname)
    return sentiment

@app.post("/audio/search/")
async def audio_search(files : List[UploadFile] = File(...), query: str = Form(...)):
    f_contents = [await f.read() for f in files]
    fnames = [f.filename for f in files]
    fnames = [os.path.join(os.getcwd(), fname) for fname in fnames]
    for i in range(len(fnames)):
        with open(fnames[i], 'wb') as f:
            f.write(f_contents[i])
    answer, audio = search(fnames, query)
    return {
        "answer": answer,
        "audio": audio
    }

@app.post("/audio/qna/")
async def audio_qna(files : List[UploadFile] = File(...), query: str = Form(...)):
    f_contents = [await f.read() for f in files]
    fnames = [f.filename for f in files]
    fnames = [os.path.join(os.getcwd(), fname) for fname in fnames]
    for i in range(len(fnames)):
        with open(fnames[i], 'wb') as f:
            f.write(f_contents[i])

    answer = QnA(fnames, query)
    return answer

@app.post("/text/translate/")
async def text_translate(request: Translate):
    request_json = eval(request.json())
    output_language = request_json["output_language"]
    text = request_json["text"]
    translated_text = translate(text, output_language)
    return translated_text

@app.post("/text/summary/")
async def text_summary(text: str = Form(...)):
    summary = summarize_text(text)
    return summary

@app.post("/text/sentiment/")
async def text_sentiment(text: str = Form(...)):
    sentiment = sentiment_text(text)
    return sentiment

@app.post("/text/qna/")
async def text_qna(text: str = Form(...), query: str = Form(...)):
    answer = QnA_text(text, query)
    return answer

@app.get("/openapi.json", include_in_schema=False)
async def get_open_api_endpoint():
    return JSONResponse(get_openapi(title="Swagger Documentation", version="1.0", routes=app.routes))
