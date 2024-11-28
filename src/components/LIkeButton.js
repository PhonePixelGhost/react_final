import React from "react";
import { db } from "../firebase";

const LikeButton = ({ postId }) => {
  const handleLikePost = () => {
    db.collection("posts").doc(postId).update({
      likes: firebase.firestore.FieldValue.increment(1),
    });
  };

  return <button onClick={handleLikePost}>Like</button>;
};

export default LikeButton;
