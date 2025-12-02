import os
import chromadb

CHROMA_DB_PATH = os.path.expanduser("~/.chroma_db_data")
client = chromadb.PersistentClient(path=CHROMA_DB_PATH)
collections = client.list_collections()
for c in collections: 
    
    sample = c.get(limit=1, include=["documents", "metadatas"])
    if sample["documents"]: 
        print("sample docs: ", sample["documents"][:300])
        print("metadatas: ", sample["metadatas"])
    else: 
        print("no doocuments found")

