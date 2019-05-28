import React, { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Editor, EditorState } from "draft-js";
import { ClipLoader } from "react-spinners";

function App() {
  const [topics, setTopics] = useState([]);
  const [isFetchData, setIsFetchData] = useState(false);
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const editor = useRef(null);

  function focusEditor() {
    editor.current.focus();
  }

  function fetchData() {
    // Clear topics.
    setTopics([]);
    // Set fetch data status.
    setIsFetchData(true);
    // Get current text.
    const currentText = editorState.getCurrentContent().getPlainText();
    // POST params.
    const params = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        content: currentText
      })
    };
    // Fecth data from api.
    fetch("http://localhost:8000/article/", params)
      .then(res => res.json())
      .then(data => {
        const { result } = JSON.parse(data.replace(/'/g, '"'));
        setTopics(result);
        setIsFetchData(false);
      })
      .catch(_ => {
        setTopics([]);
        setIsFetchData(false);
      });
  }

  useEffect(() => {
    focusEditor();
  }, []);

  return (
    <div className="container p-5">
      <h1 className="text-success" style={{ fontSize: "60px" }}>
        Article Topic
      </h1>
      <div
        className="border p-5 my-5"
        style={{ borderRadius: "12px" }}
        onClick={focusEditor}
      >
        <Editor
          ref={editor}
          editorState={editorState}
          onChange={value => setEditorState(value)}
        />
      </div>
      <input
        className="form-control btn btn-success d-inline mb-5"
        style={{ borderRadius: "12px" }}
        type="button"
        value="Suggest a topic"
        onClick={fetchData}
      />
      {isFetchData && topics && !topics.length && (
        <div className="text-center">
          <ClipLoader sizeUnit={"px"} size={40} color={"#123abc"} />
        </div>
      )}
      {topics && !topics.length && (
        <p className="text-center text-danger h4">Nothing</p>
      )}
      {topics && topics.length > 0 && (
        <div className="border-bottom d-flex mb-5">
          <p className="h4 text-primary w-100 ml-5">Topic</p>
          <p className="h4 text-primary mr-5">Rate</p>
        </div>
      )}
      {topics &&
        topics.length > 0 &&
        topics.map((topic, index) => (
          <div className="border-bottom d-flex mb-5" key={index}>
            <p className="h3 text-info w-100 ml-5">{topic.topic}</p>
            <p
              className="badge badge-success mr-5"
              style={{ fontSize: "18px" }}
            >
              {parseFloat(topic.rate * 100).toFixed(2)}%
            </p>
          </div>
        ))}
      <p className="text-secondary text-center mt-5">
        <span role="img" aria-label="emoji">
          Made with ⌨️ and 🙌
        </span>
        <br />
        <small className="text-secondary">© 2019 cuongw</small>
      </p>
    </div>
  );
}

export default App;
