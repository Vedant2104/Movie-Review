# Movie-Review

## Download raw file

---

## Frontend setup
   ```
   cd frontend
   npm i
   ```

---

## Backend setup
   ```
   cd backend
   npm i
   ```

---

## Python setup (recommended Python version: 3.12)

   ### Windows:
   ```
   cd python_backend
   python -m venv .venv
   .venv\Scripts\activate
   pip install -r dependencies.txt
   ```

   ### macOS:
   ```
   cd python_backend
   python3 -m venv .venv
   source .venv/bin/activate
   pip3 install -r dependencies.txt
   ```

   ### Notes:
   - Download cleantext and stopwords from the website if there is a certificate verification issue.
   - If dependencies are not automatically installed, install them manually:
     ```
     pip install <library-name>
     pip3 install <library-name>
     ```

   #### Important Libraries:
   - numpy
   - pandas
   - pymongo
   - sklearn
   - tensorflow
   - cleantext
   - streamlit (for prototype)
   - Flask
   - Flask-Cors
   - bs4

---

## Create API key
   - Obtain an API key from IMDb for web scraping and search (a free trial version is available).

---

## Run Commands

   ### Python backend:
   ```
   cd python_backend
   .venv\Scripts\activate
   python -m flask_backend
   ```

   ### Backend:
   ```
   cd backend
   node index.js
   # or
   nodemon
   ```

   ### Frontend:
   ```
   cd frontend
   npm run dev
   ```

   - **Tip**: Ctrl+click the link provided in the terminal to open the website.
