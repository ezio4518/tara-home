from langchain.schema import Document

def format_product_to_document(product: dict) -> Document:
    """
    Converts a product dictionary into a rich LangChain Document for RAG ingestion.
    """
    content = f"""
    🛒 Product Name: {product['name']}
    📄 Description: {product['description']}
    💰 Price: ₹{product['price']}
    📦 Category: {product['category']}
    📂 Subcategory: {product['subCategory']}
    🔥 Bestseller: {'Yes' if product['bestseller'] else 'No'}
    📆 Date: {product['date']}
    🕒 Created At: {product['createdAt']}
    """
    return Document(page_content=content.strip(), metadata={"name": product["name"]})