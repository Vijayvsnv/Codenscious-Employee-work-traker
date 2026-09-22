# import google.generativeai as genai
# from core.config import settings

# # API key set
# genai.configure(api_key=settings.GEMINI_API_KEY)

# def get_llm_response(prompt: str):
#     model = genai.GenerativeModel("gemini-2.5-flash")  

#     response = model.generate_content(prompt)

#     return response.text

from langchain_openai import ChatOpenAI
from langchain.schema import HumanMessage
from core.config import settings

llm = ChatOpenAI(
    model="gpt-4o-mini",
    openai_api_key=settings.OPENAI_API_KEY,
    temperature=0.7
)

def get_llm_response(prompt: str) -> str:
    response = llm.invoke([HumanMessage(content=prompt)])
    return response.content