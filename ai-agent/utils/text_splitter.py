from langchain.text_splitter import RecursiveCharacterTextSplitter

splitter = RecursiveCharacterTextSplitter(
    chunk_size=500,
    chunk_overlap=50,
    separators=["\n\n", "\n", ".", "!", "?", ",", " "]
)

def split_documents(documents):
    """
    Takes a list of LangChain Documents and returns smaller chunks using a text splitter.
    """
    return splitter.split_documents(documents)