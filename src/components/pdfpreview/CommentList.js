import React, { useState, useEffect } from "react";
import { useRecoilValue } from "recoil";
import { filedatastate } from "../../context/filedataState";
import axios from "axios";
import "./CommentList.css";

const REACT_APP_BASE_URL = process.env.REACT_APP_BASE_URL;

const post_comment = async (data, token) => {
  try {
    const response = await axios.post(
      `${REACT_APP_BASE_URL}uploads/comment`,
      JSON.stringify(data),
      {
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    if (error.response) {
      // console.log(error.response);
      const { status, data } = error.response;
      console.error(`Error posting comment (${status}): ${data.error}`);
    } else if (error.request) {
      console.error("No response received from the server. Please try again.");
    } else {
      console.error(
        "An error occurred while posting the comment. Please try again."
      );
    }
  }
};

const Comment = ({ comment, onUpdate }) => {
  const [showReplies, setShowReplies] = useState(false);
  const [replyContent, setReplyContent] = useState("");

  const token = sessionStorage.getItem("token");
  const { file_id } = useRecoilValue(filedatastate);
  const toggleReplies = () => {
    setShowReplies(!showReplies);
  };

  const handleReplyChange = (event) => {
    setReplyContent(event.target.value);
  };

  const handleReplySubmit = async (event) => {
    event.preventDefault();
    // Send API request to add the reply with replyContent
    // Update the comment object with the new reply
    const newReply = {
      content: replyContent,
      parent_id: comment.comment_id,
      file_id: file_id,
    };

    const resp = await post_comment(newReply, token);
    // console.log(resp);
    setReplyContent("");
    onUpdate();
  };

  const renderReplies = comment.replies.map((reply) => (
    <div key={reply.comment_id} className="reply">
      <p className="comment-content">{reply.content}</p>
      <p>By: {reply.author}</p>
      <p>{reply.timestamp}</p>
    </div>
  ));

  return (
    <div className="comment">
      <div className="parent-comment">
        <p className="comment-content">{comment.content}</p>
        <p>By: {comment.author}</p>
        <p>{comment.timestamp}</p>
      </div>
      {comment.replies.length > 0 && (
        <button onClick={toggleReplies}>
          {showReplies ? "Hide Replies" : "Show Replies"}
        </button>
      )}
      {showReplies && <div className="replies">{renderReplies}</div>}
      <form onSubmit={handleReplySubmit} className="reply-form">
        <input
          type="text"
          placeholder="Reply..."
          value={replyContent}
          onChange={handleReplyChange}
        />
        <button type="submit">Add Reply</button>
      </form>
    </div>
  );
};

const CommentList = () => {
  const { file_id } = useRecoilValue(filedatastate);
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [mainContent, setMainContent] = useState();
  const [flag, setFlag] = useState(false);

  //   console.log(file_id);
  const token = sessionStorage.getItem("token");

  useEffect(() => {
    const get_comments = async () => {
      const data = await axios.get(
        `${REACT_APP_BASE_URL}uploads/comments?file_id=${file_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return data.data.comments;
    };
    const fetchComments = async () => {
      try {
        const data = await get_comments();
        setComments(data);
        // console.log(comments);
      } catch (error) {
        // Handle error (e.g., display an error message)
        console.error(error.response.data.errror);
      }
    };

    fetchComments();
  }, [file_id, flag]);

  const updateHandler = () => {
    setFlag(!flag);
  };

  const addCommentHandler = async () => {
    const new_comment = {
      content: mainContent,
      file_id: file_id,
    };
    const resp = await post_comment(new_comment, token);
    setMainContent("");
    updateHandler();
  };
  return (
    <div className="comment-container">
      <h1>Comments</h1>
      <div className="add-comment">
        <input
          type="text"
          placeholder="Enter New Comment"
          value={mainContent}
          onChange={(event) => {
            setMainContent(event.target.value);
          }}
        />
        <button onClick={addCommentHandler}>Add</button>
      </div>
      {comments.map((comment) => (
        <Comment
          key={comment.comment_id}
          comment={comment}
          onUpdate={updateHandler}
        />
      ))}
    </div>
  );
};

export default CommentList;
