import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score
import joblib
import os
import re

def clean_text(text):
    text = str(text).lower()
    text = re.sub(r"http\S+", "", text)
    text = re.sub(r"[^a-zA-Z\s]", "", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text


# Read the file and handle mixed CSV/TSV format
data_rows = []
with open("datasets/documents.csv", 'r', encoding='utf-8') as f:
    lines = f.readlines()
    
for i, line in enumerate(lines):
    line = line.strip()
    if not line or line.startswith('text_content'):  # Skip header rows
        continue
    
    # Try to parse as CSV (comma-separated, possibly quoted)
    if line.startswith('"'):
        # Quoted CSV format: "text content",label
        try:
            last_quote = line.rfind('"')
            text = line[1:last_quote]  # Get text between quotes
            label_part = line[last_quote+1:].strip().lstrip(',')
            label = int(label_part)
            data_rows.append({'text_content': text, 'label': label})
        except:
            pass
    elif '\t' in line:
        # Tab-separated format: text content<TAB>label
        parts = line.rsplit('\t', 1)
        if len(parts) == 2:
            try:
                text = parts[0].strip()
                label = int(parts[1].strip())
                data_rows.append({'text_content': text, 'label': label})
            except:
                pass

df = pd.DataFrame(data_rows)
df.dropna(inplace=True)

df["cleaned"] = df["text_content"].apply(clean_text)
X = df["cleaned"]
y = df["label"]

vectorizer = TfidfVectorizer(max_features=5000)
X_vec = vectorizer.fit_transform(X)

X_train, X_test, y_train, y_test = train_test_split(X_vec, y, test_size=0.2, random_state=42)

model = LogisticRegression()
model.fit(X_train, y_train)

y_pred = model.predict(X_test)
print("Accuracy:", accuracy_score(y_test, y_pred))
print(classification_report(y_test, y_pred))

os.makedirs("app/models", exist_ok=True)
joblib.dump(model, "app/models/doc_model.pkl")
joblib.dump(vectorizer, "app/models/doc_vectorizer.pkl")
