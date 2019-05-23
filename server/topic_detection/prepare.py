from gensim.utils import simple_preprocess

def clean_text(text):
    process_text = simple_preprocess(text)
    process_text = ' '.join(process_text)
    return process_text

def preprocess_text(texts, tokenizer):
    tok_doc = []
    # i = len(texts)
    # for text in texts:
    #     print(text)
    if isinstance(texts, str):
        texts = clean_text(texts)
        tok_txt = tokenizer.tokenize(texts)
        tok_doc.append(tok_txt)

    return tok_doc