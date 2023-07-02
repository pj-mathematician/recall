from fastapi import *
from typing import List
# from utils import *
from fastapi.openapi.utils import get_openapi
from transcription.utilities import *

app = FastAPI(debug = True)


# @app.get("/")
# async def root():
#     return {"message": "Hello World"}
#
#
# @app.get("/hello/{name}")
# async def say_hello(name: str):
#     return {"message": f"Hello {name}"}
#
# # POST /chat/ with r Request
# @app.post("/chat/")
# async def chat(r: Request):
#     data = await r.json()
#     data = data["messages"]
#     response = None
#     if data[1]['user'] == 'Previous Year Cutoffs':
#         if len(data) == 2:
#             response = "Which state are you from? Delhi or Outside Delhi?"
#         elif len(data) == 4:
#             response = "Which category do you belong to? GN (General), OBC (OB), SC (SC), ST (ST), EWS (EW)?"
#         elif len(data) == 6:
#             response = "What is your JEE Mains rank?"
#         elif len(data) == 8:
#             state = data[3]['user']
#             category = data[5]['user']
#             rank = int(data[7]['user'])
#             courses, ranks = get_streams(state, category, category, rank)
#             response = f"Your rank is {rank} and you can get into {courses[0]} with a rank of {ranks[0]} in 2022, {courses[1]} with a rank of {ranks[1]} in 2021 and {courses[2]} with a rank of {ranks[2]} in 2020"
#     else:
#         response = "Only Previous Year Cutoffs are available right now"
#     return {"message": response}
#
# # POST /cutoff/ with r Request. It is a JSON with "state", "category", "subcategory" and "rank" as keys
# @app.post("/cutoff/")
# async def cutoff(r: Request):
#     try:
#         data = await r.json()
#         state = data["state"]
#         category = data["category"]
#         subcategory = data["subcategory"]
#         rank = int(data["rank"])
#         try:
#             courses, ranks, campuses = get_streams_main(state, category, subcategory, rank)
#             response = f"""Your rank is {rank} and your JAC category code is {category+subcategory+state[0]}.
#     Based on the previous year JAC cutoffs, you can get admission in the following courses:
#     {courses[0]} with a rank of {int(ranks[0])} in 2022
#     {courses[1]} with a rank of {int(ranks[1])} in 2021
#     {courses[2]} with a rank of {int(ranks[2])} in 2020"""
#         except:
#             courses, ranks, campuses = get_streams_main(state, 'GN', 'GN', rank)
#             response = f"""Cutoffs for JAC category code is {category + subcategory + state[0]} are not available. Here are the cutoffs corresponding to GNGN{state[0]} category with rank {rank}.
#     Based on the previous year JAC cutoffs, you can get admission in the following courses:
#     {courses[0]} with a rank of {int(ranks[0])} in 2022
#     {courses[1]} with a rank of {int(ranks[1])} in 2021
#     {courses[2]} with a rank of {int(ranks[2])} in 2020"""
#         # return {"message": response}
#         courses = [str(i) for i in courses]
#         ranks = [int(i) for i in ranks]
#         campuses = [str(i) for i in campuses]
#         return {
#             "message": response,
#             "JAC_category": category+subcategory+state[0],
#             "courses": courses,
#             "ranks": ranks,
#             "campuses": campuses
#         }
#     except Exception as e:
#         return {
#             "error": "error"
#         }
#
# @app.post("/cutoff/stream/")
# async def cutoff_stream(r: Request):
#     try:
#         data = await r.json()
#         state = data["state"]
#         category = data["category"]
#         subcategory = data["subcategory"]
#         campus = data["campus"]
#         stream = data["stream"]
#         try:
#             courses, ranks = get_choose_stream(campus, category, subcategory, state, stream)
#         except:
#             courses, ranks = get_choose_stream(campus, 'GN', 'GN', state, stream)
#         return {
#             "courses": courses["2022"],
#             "ranks": ranks
#         }
#     except Exception as e:
#         return {
#             "error": "error"
#         }
#

@app.post("/audio/transcribe/file/")
async def audio_transcribe(file: UploadFile = File(...)):
    contents = await file.read()
    fname = file.filename
    fname = os.path.join(os.getcwd(), fname)
    with open(fname, "wb") as f:
        f.write(contents)
    trans_ = transcribe(fname)
    os.remove(fname)
    return trans_

@app.get("/openapi.json", include_in_schema=False)
async def get_open_api_endpoint():
    return JSONResponse(get_openapi(title="Swagger Documentation", version="1.0", routes=app.routes))
