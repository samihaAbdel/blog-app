import React, { useState } from "react";
import CommentForm from "./CommentForm";
import  toast  from 'react-hot-toast'
import Comment from "./Comment";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNewComment, deleteComment, updateComment } from "../../services/index/comment";
import { useSelector } from "react-redux";

const CommentConatiner = ({
  className,
  logginedUserId,
  comments,
  postSlug,
}) => {
  const queryClient = useQueryClient()
  const userState = useSelector((state) => state.user);
  const [affectedComment, setAffectedComment] = useState(null);
  const { mutate: mutateNewComment, isLoading: isLoadingNewComment } =
    useMutation({
      mutationFn: ({ token, desc, slug, parent, replyOnUser }) => {
        return createNewComment({ token, desc, slug, parent, replyOnUser });
      },
      onSuccess: () => {
        toast.success("Your comment is passed successfully, it's will be visible after confirmation of Admin!!")
      },
      onError: (error) => {
        toast.error(error.message)
        console.log(error)
      }
    });
  const { mutate: mutateUpdateComment } =
    useMutation({
      mutationFn: ({ token, desc,commentId }) => {
        return updateComment({ token, desc,commentId });
      },
      onSuccess: () => {
        toast.success("Your comment is updated successfully")
        queryClient.invalidateQueries(["blog", postSlug])
      },
      onError: (error) => {
        toast.error(error.message)
        console.log(error)
      }
    });
  const { mutate: mutateDeleteComment } =
    useMutation({
      mutationFn: ({ token, commentId }) => {
        return deleteComment({ token,commentId });
      },
      onSuccess: () => {
        toast.success("Your comment is deleted successfully")
        queryClient.invalidateQueries(["blog", postSlug])
      },
      onError: (error) => {
        toast.error(error.message)
        console.log(error)
      }
    });
  const addCommentHandler = (value, parent = null, replyOnUser = null) => {
    mutateNewComment({
      desc: value,
      parent,
      replyOnUser,
      token: userState.userInfo.token,
      slug: postSlug,
    });
    setAffectedComment(null);
  };
  const updateCommentHandler = (value, commentId) => {
    mutateUpdateComment({token:userState.userInfo.token, desc: value, commentId})
    setAffectedComment(null);
  };
  const deleteCommentHandler = (commentId) => {
    mutateDeleteComment({ token: userState.userInfo.token, commentId })
  };

  return (
    <div className={`${className}`}>
      <CommentForm
        btnLabel="Send"
        formSubmitHandler={(value) => addCommentHandler(value)}
        loading = {isLoadingNewComment}
      />
      <div className="space-y-4 mt-8 w-full md:w-[350px] ">
        {comments.map((comment) => (
          <Comment
            key={comment._id}
            comment={comment}
            logginedUserId={logginedUserId}
            affectedComment={affectedComment}
            setAffectedComment={setAffectedComment}
            addComment={addCommentHandler}
            updateComment={updateCommentHandler}
            deleteComment={deleteCommentHandler}
            replies={comment.replies}
          />
        ))}
      </div>
    </div>
  );
};

export default CommentConatiner;
