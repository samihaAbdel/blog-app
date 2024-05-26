import React, { useEffect, useState } from "react";
import MainLayout from "../../components/MainLayout";
import BreadCrumbs from "../../components/BreadCrumbs";
import { images, stables } from "../../constants";
import { Link, useParams } from "react-router-dom";
import SuggestedPosts from "./container/SuggestedPosts";
import CommentConatiner from "../../components/comments/CommentConatiner";
import SocialShareButton from "../../components/comments/SocialShareButton";
import { useQuery } from "@tanstack/react-query";
import { getAllPosts, getSinglePost } from "../../services/index/post";

import ArticleDetailSkeleton from "./components/ArticleDetailSkelton";
import ErrorMessage from "../../components/ErrorMessage";
import { useSelector } from "react-redux";
import parseJsonToHtml from "../../utils/parseJsonToHtml";

const ArticleDetailpage = () => {
  const { slug } = useParams();
  const userState = useSelector((state) => state.user);
  const [breadCrumbsData, setBreadCrumbsData] = useState([]);
  const [body, setBody] = useState(null);

  const { data, isLoading, error, isError } = useQuery({
    queryFn: () => getSinglePost({ slug }),
    queryKey: ["blog", slug],
  });
  const { data: postsData } = useQuery({
    queryFn: () => getAllPosts(),
    queryKey: ["posts"],
  });

  const handleSuccess = (data) => {
    setBreadCrumbsData([
      { name: "Home", link: "/" },
      { name: "Blog", link: "/blog" },
      { name: data.title, link: `/blog/${data.slug}` },
    ]);
    setBody(parseJsonToHtml(data?.body));
  };

  useEffect(() => {
    if (!isLoading && !error && data) {
      handleSuccess(data);
    }
  }, [data]);

  // console.log(data);
  return (
    <MainLayout>
      {isLoading ? (
        <ArticleDetailSkeleton />
      ) : isError ? (
        <ErrorMessage message="Couldn't fetch the post detail" />
      ) : (
        <section className="container mx-auto max-w-4xl flex flex-col px-5 py-5 lg:flex-row lg:gap-x-5 lg:items-start">
          <article className="flex-1">
            <BreadCrumbs data={breadCrumbsData} />
            <img
              src={
                data?.photo
                  ? stables.UPLOAD_FOLDER_BASE_URL + data?.photo
                  : images.samplePostImg
              }
              alt={data?.title}
              className="rounded-xl w-full"
            />
            <div className=" mt-4 flex gap-2">
              {data?.categories.map((cat) => (
                <Link
                  to={`/blog?category=${cat.name}`}
                  className="text-primary text-sm font-roboto inline-block md:text-base "
                >
                  {" "}
                  {cat.name}
                </Link>
              ))}
            </div>
            <h1 className="text-xl font-medium font-roboto mt-4 text-dark-hard md:text-[26px]">
              {data?.title}
            </h1>
            <div className="mt-4 prose prose-sm sm:prose-base">{body}</div>
            <CommentConatiner
              comments={data?.comments}
              className="mt-10"
              logginedUserId={userState?.userInfo?._id}
              postSlug={slug}
            />
          </article>
          <SuggestedPosts
            header="Latest Article"
            posts={postsData?.data}
            tags={data?.tags}
            className="mt-8  lg:mt-0 lg:max-w-xs"
          />
          <div className="mt-7">
            <h2 className="font-roboto font-medium text-dark-hard mb-4 md:text-xl ">
              Share on:
            </h2>
            <SocialShareButton
              url={encodeURI(window.location.href)}
              title={encodeURIComponent(data?.title)}
            />
          </div>
        </section>
      )}
    </MainLayout>
  );
};

export default ArticleDetailpage;
