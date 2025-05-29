from langchain.vectorstores import Chroma
from langchain.embeddings import HuggingFaceEmbeddings
from utils.text_splitter import split_documents


EMBED_MODEL = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)

def initialize_vectorstore(initial_docs):
    """
    Splits, embeds, and stores documents into ChromaDB. Returns retriever and vectorstore.
    """
    chunks = split_documents(initial_docs)
    vectorstore = Chroma.from_documents(
        documents=chunks,
        embedding=EMBED_MODEL,
        persist_directory="vectorstore/"
    )
    return vectorstore.as_retriever(), vectorstore