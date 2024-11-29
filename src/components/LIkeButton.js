import React, { useState, useEffect } from 'react';
import { db } from '../firebase/firebaseConfig';
import { doc, updateDoc, getDoc } from 'firebase/firestore';

function LikeButton({ post, username, isAuthenticated }) {
  const [likes, setLikes] = useState(post.likes || 0);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    // Check if the user has liked the post
    const checkIfLiked = async () => {
      const postRef = doc(db, 'posts', post.id);
      const postDoc = await getDoc(postRef);
      if (postDoc.exists()) {
        const postData = postDoc.data();
        setLikes(postData.likes || 0);
        setIsLiked(postData.likedBy?.includes(username) || false);
      }
    };

    checkIfLiked();
  }, [post.id, username]);

  const handleLike = async () => {
    if (!isAuthenticated) {
      alert('You need to log in to like posts.');
      return;
    }

    const postRef = doc(db, 'posts', post.id);

    try {
      if (isLiked) {
        // Unlike the post
        await updateDoc(postRef, {
          likes: likes - 1,
          likedBy: { arrayRemove: username },
        });
        setLikes(likes - 1);
      } else {
        // Like the post
        await updateDoc(postRef, {
          likes: likes + 1,
          likedBy: { arrayUnion: username },
        });
        setLikes(likes + 1);
      }
      setIsLiked(!isLiked);
    } catch (error) {
      console.error('Error updating likes:', error);
    }
  };

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <h5 className="card-title text-primary">{post.title}</h5>
        <p className="card-text">{post.content}</p>
        <p className="text-muted">Posted by: {post.username}</p>
        <div className="d-flex justify-content-between">
          <button className="btn btn-warning btn-sm" onClick={handleLike}>
            {isLiked ? 'Unlike' : 'Like'} ({likes})
          </button>
          {/* Add other actions like delete or edit if needed */}
        </div>
      </div>
    </div>
  );
}

export default LikeButton;
