# Movie-Review

download raw file

frontend setup
   cd frontend
   npm i

backend setup
   cd backend
   npm i

python setup (recommended python version: 3.12)
   cd python_backend
   
   Windows
   python -m venv .venv
   .venv\Scripts\activate
   pip install -r dependencies.txt
   
   macOS
   python3 -m venv .venv
   source .venv/bin/activate
   pip3 install -r dependencies.txt
   download cleantext stopwords from website if there is certificate verification issue

   If dependencies are not automatically installed install them one by one manually
      pip install <library-name>
      pip3 install <library-name>
      Important Libraries
         numpy
         pandas
         pymongo
         sklearn
         tensorflow
         cleantext
         streamlit (for prototype)
         Flask
         Flask-Cors
         bs4

Create API key from ImDb for web scraping and search(There is free trial version)

Run Commands
   cd python_backend
   .venv\Scripts\activate
   python -m flask_backend

   cd backend
   node index.js (or) nodemon

   cd frontend
   npm run dev
   ctrl+click the link provided in terminal to open the website

