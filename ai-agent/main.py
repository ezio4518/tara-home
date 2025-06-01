import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from utils.text_splitter import split_documents
from langchain.chains import RetrievalQA
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.schema import Document
from langchain_community.document_loaders import TextLoader
from utils.formatter import format_product_to_document
from utils.retriever import initialize_vectorstore
import uvicorn

# Load environment variables
load_dotenv()
os.environ["GOOGLE_API_KEY"] = os.getenv("GOOGLE_API_KEY")

# Initialize FastAPI app
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # for development; restrict in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def load_existing_products():
    import json
    if os.path.exists("data/products.json"):
        with open("data/products.json", "r", encoding="utf-8") as f:
            return json.load(f)
    return []

# Load and split documents
faq_docs = []
if os.path.exists("data/faq.txt"):
    raw_faq_docs = TextLoader("data/faq.txt").load()
    faq_docs = split_documents(raw_faq_docs)

product_docs = []
existing_products = load_existing_products()
if existing_products:
    formatted_products = [format_product_to_document(p) for p in existing_products]
    product_docs = split_documents(formatted_products)

# Combine docs and initialize vector store
all_docs = faq_docs + product_docs
retriever, vectorstore = initialize_vectorstore(all_docs)

# Initialize LLM + QA chain
llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash", temperature=0.2)
qa_chain = RetrievalQA.from_chain_type(llm=llm, retriever=retriever)

# Request models
class Query(BaseModel):
    question: str

class Product(BaseModel):
    name: str
    description: str
    price: float
    category: str
    subCategory: str
    bestseller: bool
    date: int
    createdAt: str

@app.get("/")
async def root():
    return {"message": "AI agent is running"}

@app.post("/chat")
async def chat(query: Query):
    try:
        response = qa_chain.invoke(query.question)
        return {"response": response}
    except Exception as e:
        return {"error": str(e)}

@app.post("/update-product")
async def update_product(product: Product):
    doc = format_product_to_document(product.dict())
    split_docs = split_documents([doc])
    vectorstore.add_documents(split_docs)

    global retriever, qa_chain
    retriever = vectorstore.as_retriever()
    qa_chain = RetrievalQA.from_chain_type(llm=llm, retriever=retriever)

    return {"status": "Product added to vector store"}

# 👇 Ensure uvicorn uses correct host and port when running on Render
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=False)
