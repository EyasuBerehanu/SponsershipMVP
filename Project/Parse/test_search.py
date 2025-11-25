from ddgs import DDGS

print("Testing DuckDuckGo Search...")
try:
    with DDGS() as ddgs:
        results = list(ddgs.text("University of Oregon sponsors", max_results=3))
        if results:
            print(f"✅ Found {len(results)} results:")
            for r in results:
                print(f"- {r['title']}: {r['href']}")
        else:
            print("❌ No results found.")
except Exception as e:
    print(f"❌ Error: {e}")
