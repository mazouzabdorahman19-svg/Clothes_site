import re
import urllib.request
import os

html_file = r'c:\Users\Welcome Said\Documents\Site_web_outfit\index.html'
css_file = r'c:\Users\Welcome Said\Documents\Site_web_outfit\style.css'

with open(html_file, 'r', encoding='utf-8') as f:
    html = f.read()

with open(css_file, 'r', encoding='utf-8') as f:
    css = f.read()

# Find all image links
urls = re.findall(r'src="(https://images.unsplash.com/[^"]+)"', html)
bg_urls = re.findall(r"url\('?(https://images.unsplash.com/[^']+)'?\)", css)
html_bg_urls = re.findall(r"url\('?(https://images.unsplash.com/[^']+)'?\)", html)

all_urls = list(set(urls + bg_urls + html_bg_urls))
img_dir = r'c:\Users\Welcome Said\Documents\Site_web_outfit\assets\images\products'

if not os.path.exists(img_dir):
    os.makedirs(img_dir)

print(f"Found {len(all_urls)} images to download...")

for i, url in enumerate(all_urls):
    filename = f"image_{i+1}.jpg"
    filepath = os.path.join(img_dir, filename)
    print(f"Downloading {filename}...")
    
    try:
        # Add User-Agent to avoid 403 Forbidden from some CDNs
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as response, open(filepath, 'wb') as out_file:
            data = response.read()
            out_file.write(data)
            
        local_path = f"assets/images/products/{filename}"
        
        # Replace in HTML
        html = html.replace(url, local_path)
        # Replace in CSS
        css = css.replace(url, local_path)
        
    except Exception as e:
        print(f"Failed to download {url}: {e}")

with open(html_file, 'w', encoding='utf-8') as f:
    f.write(html)
    
with open(css_file, 'w', encoding='utf-8') as f:
    f.write(css)

print("Done downloading and updating files!")
