from datetime import date
from typing import List, Optional
from pydantic import BaseModel
from fastapi import *

class Translate(BaseModel):
    output_language: str
    text: str
class Search(BaseModel):
    files: List[UploadFile] = []
    text: str