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

# 🔐 Load .env with Gemini API key
load_dotenv()
os.environ["GOOGLE_API_KEY"] = os.getenv("GOOGLE_API_KEY")

# 🚀 Initialize FastAPI app
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # for development; restrict in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 📚 Load and split FAQ.txt
faq_path = "data/faq.txt"
faq_docs = []
if os.path.exists(faq_path):
    raw_faq_docs = TextLoader(faq_path).load()
    faq_docs = split_documents(raw_faq_docs) # 🔥 Apply splitter

# 🧠 Build vectorstore and retriever
retriever, vectorstore = initialize_vectorstore(faq_docs)

# 💬 Setup Gemini Pro via LangChain
llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash", temperature=0.2)
qa_chain = RetrievalQA.from_chain_type(llm=llm, retriever=retriever)

# 📦 Define request models
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

# 🧠 /chat endpoint
@app.post("/chat")
def chat(query: Query):
    try:
        response = qa_chain.invoke(query.question)
        return {"response": response}
    except Exception as e:
        return {"error": str(e)}

# 🔄 /update-product endpoint
@app.post("/update-product")
def update_product(product: Product):
    doc = format_product_to_document(product.dict())
    split_docs = split_documents([doc])
    vectorstore.add_documents(split_docs)

    # ✅ Refresh retriever and QA chain so it uses updated data
    global retriever, qa_chain
    retriever = vectorstore.as_retriever()
    qa_chain = RetrievalQA.from_chain_type(llm=llm, retriever=retriever)

    return {"status": "Product added to vector store"}