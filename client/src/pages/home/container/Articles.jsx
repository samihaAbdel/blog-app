import React from "react";
import ArticleCard from "../../../components/ArticleCard";
import { FaArrowRight } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import { getAllPosts } from "../../../services/index/post";
import toast from "react-hot-toast";
import ArticleCardSkelton from "../../../components/ArticleCardSkelton";
import ErrorMessage from "../../../components/ErrorMessage";

const Articles = () => {
  const { data, isLoading, isError} = useQuery({
    queryFn: () => getAllPosts(),
    queryKey: ["posts"],
    onError: (error) => {
      toast.error(error.message);
      console.log(error);
    },
  });
  // console.log(isLoading);
  // console.log(isError);
  // console.log(data);
  return (
    <section className="flex flex-col container mx-auto px-5 py-10">
      <div className="flex flex-wrap md:gap-x-5 gap-y-5 pb-10">
        {isLoading ? (
          [...Array(3)].map((item, index) => (
            <ArticleCardSkelton
              key={index}
              className="w-full md:w-[calc(50%-20px)] lg:w-[calc(33.33%-21px)]"
            />
          ))
        ) : isError ? (
            <ErrorMessage message="Couldn't fetch the post data" />
        ) : (
          data?.data.map((post) => (
            <ArticleCard
              key={post._id}
              post={post}
              className="w-full md:w-[calc(50%-20px)] lg:w-[calc(33.33%-21px)]"
            />
          ))
        )}
        {/* <ArticleCard className="w-full md:w-[calc(50%-20px)] lg:w-[calc(33.33%-21px)]" /> */}
      </div>
      <button className="mx-auto flex items-center  gap-x-2 font-bold text-primary border-2  border-primary px-6 py-3  rounded-lg">
        <span>More articles</span>
        <FaArrowRight className="w-3 h-3" />
      </button>
    </section>
  );
};

export default Articles;
