import React from "react";
import images from "../constants/images";
import stables from "../constants/stables";
import { IoCheckmarkDoneOutline } from "react-icons/io5";
import { AiOutlineClose } from "react-icons/ai";
import { Link } from "react-router-dom";
const ArticleCard = ({ className, post }) => {
  return (
    <div
      className={`rounded-xl overflow-hidden shadow-[rgba(0,_0,_0,_0.25)_0px_25px_50px_-12px]`}
    >
      <Link to={`/blog/${post.slug}`}>
        <img
          className="w-full object-cover object-center h-auto md:h-52 lg:h-48 xl:h-60"
          src={
            post.photo
              ? stables.UPLOAD_FOLDER_BASE_URL + post.photo
              : images.samplePostImg
          }
          alt="title"
        />
      </Link>
      <div className="p-5">
        <Link to={`/blog/${post.slug}`}>
          <h2 className="font-roboto  font-bold text-xl text-dark-soft md:text-2xl lg:text-[28px]   ">
            {post.title}
          </h2>
          <p className="text-dark-light mt-3 text-sm md:text-lg ">
            {post.caption}
          </p>
        </Link>
        <div className="flex justify-between flex-nowrap items-center mt-6">
          <div className="flex items-center gap-x-2md:gap-x-2.5 ">
            <img
              src={
                post.user.avatar
                  ? stables.UPLOAD_FOLDER_BASE_URL + post.user.avatar
                  : images.avatarUserImg
              }
              alt=" post profile"
              className="w-9 h-9 md:w-10 md:h-10 rounded-full"
            />
            <div className="flex flex-col">
              <h4 className="font-bold italic text-dark-soft text-sm md:text-base">
                {post.user.name}
              </h4>
              <div className="flex items-center gap-x-2">
                <span
                  className={`${
                    post.user.verified ? "bg-[#36B37E]" : "bg-red-500"
                  }  w-fit bg-opacity-20 p-1.5 rounded-full`}
                >
                  {post.user.verified ? (
                    <IoCheckmarkDoneOutline className="w-1.5 h-1.5 text-[#36B37E]" />
                  ) : (
                    <AiOutlineClose className="w-1.5 h-1.5 text-red-500" />
                  )}
                </span>
                <span className="italic text-dark-light text-xs md:text-sm">
                  {post.user.verified ? "Verified" : "Unverfied writer"}
                </span>
              </div>
            </div>
          </div>
          <span className="font-bold text-dark-light italic text-sm md:text-base ">
            {new Date(post.createdAt).getDate()}
            <span> </span>
            {new Date(post.createdAt).toLocaleString("default", {
              month: "long",
            })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;
