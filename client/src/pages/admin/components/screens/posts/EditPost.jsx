import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getSinglePost, updatePost } from "../../../../../services/index/post";
import { Link, useNavigate, useParams } from "react-router-dom";
import ArticleDetailSkeleton from "../../../../articleDetail/components/ArticleDetailSkelton";
import ErrorMessage from "../../../../../components/ErrorMessage";
import { useState } from "react";
import { stables } from "../../../../../constants";
import { MdLinkedCamera } from "react-icons/md";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import Editor from "../../../../../components/editor/Editor";
import MultiSelectTagDropdown from "../../select-dropdown/MultiSelectTagDropdown";
import { getAllCategories } from "../../../../../services/index/postCategories";
import {
  categoryToOption,
  filterCategories,
} from "../../../../../utils/multiSelectTagUtils";
import Creatableselect from "react-select/creatable";

const promiseOptions = async (inputValue) => {
  const categoriesData = await getAllCategories();
  return filterCategories(inputValue, categoriesData);
};
const EditPost = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const userState = useSelector((state) => state.user);
  const [initialPhoto, setInitialPhoto] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [body, setBody] = useState(null);
  const [categories, setCategories] = useState(null);
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState(null);
  const [caption, setCaption] = useState("");
  const [postSlug, setPostSlug] = useState(slug);

  const { data, isLoading, isError } = useQuery({
    queryFn: () => getSinglePost({ slug }),
    queryKey: ["blog", slug],
    onSuccess: (data) => {
      setInitialPhoto(data?.photo);
      setCategories(data.categories.map((item) => item._id));
      setTitle(data.title);
      setTags(data.tags);
      setCaption(data.caption)
      setPostSlug(data.slug)
    },
    refetchOnWindowFocus: false,
  });
  const {
    mutate: mutateUpdatePostDetail,
    isLoading: isLoadingUpdatePostDetail,
  } = useMutation({
    mutationFn: ({ updatedData, slug, token }) => {
      return updatePost({
        updatedData,
        slug,
        token,
      });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["blog", slug]);
      toast.success("Post is Updated");
      navigate(`/admin/posts/manage/edit/${data.slug}`, { replace: true });
    },
    onError: (error) => {
      toast.error(error.message);
      console.log(error);
    },
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setPhoto(file);
  };
  const handleUpdatePost = async () => {
    let updatedData = new FormData();
    if (!initialPhoto && photo) {
      updatedData.append("postPicture", photo);
    } else if (initialPhoto && !photo) {
      const urlToObject = async (url) => {
        let response = await fetch(url);
        let blob = await response.blob();
        const file = new File([blob], initialPhoto, { type: blob.type });
        return file;
      };
      const picture = await urlToObject(
        stables.UPLOAD_FOLDER_BASE_URL + data?.photo
      );
      updatedData.append("postPicture", picture);
    }
    updatedData.append(
      "document",
      JSON.stringify({ body, categories, title, tags, slug: postSlug, caption })
    );

    mutateUpdatePostDetail({
      updatedData,
      slug,
      token: userState.userInfo.token,
    });
  };
  const handleDeleteImage = () => {
    if (window.confirm("Do you want to delete your picture ")) {
      setInitialPhoto(null);
      setPhoto(null);
    }
  };
  let isPostDataLoaded = !isLoading && !isError;
  // console.log("sPostData:", data)
  return (
    <div>
      {isLoading ? (
        <ArticleDetailSkeleton />
      ) : isError ? (
        <ErrorMessage message="Couldn't fetch the post detail" />
      ) : (
        <section className="container mx-auto max-w-4xl flex flex-col px-5 py-5 lg:flex-row lg:gap-x-5 lg:items-start">
          <article className="flex-1">
            <label htmlFor="postPicture" className="w-full cursor-pointer">
              {photo ? (
                <img
                  src={URL.createObjectURL(photo)}
                  alt={data?.title}
                  className="rounded-xl w-full"
                />
              ) : initialPhoto ? (
                <img
                  src={stables.UPLOAD_FOLDER_BASE_URL + data?.photo}
                  alt={data?.title}
                  className="rounded-xl w-full"
                />
              ) : (
                <div
                  className="w-full h-full min-h-[200px] bg-blue-50/50 flex justify-center
                 items-center"
                >
                  <MdLinkedCamera className="w-7 h-auto text-primary" />
                </div>
              )}
            </label>
            <input
              type="file"
              className="sr-only "
              id="postPicture"
              onChange={handleFileChange}
            />

            <p>
              <button
                type="button"
                onClick={handleDeleteImage}
                className="w-fit bg-red-500 text-sm
                 text-white font-semibold rounded-lg px-2 py-1 mt-5"
              >
                {" "}
                Delete Image
              </button>
            </p>
            <div className=" mt-4 flex gap-2">
              {data?.categories.map((cat) => (
                <Link
                  key= {cat}
                  to={`/blog?category=${cat.name}`}
                  className="text-primary text-sm font-roboto inline-block md:text-base "
                >
                  {" "}
                  {cat.name}
                </Link>
              ))}
            </div>
            <div className="d-form-control w-full ">
              <label className="d-label " htmlFor="title">
                <span className="d-label-text">Title:</span>
              </label>
              <input
                id="title"
                className="d-input d-input-bordered border-slate-300 !outline-slate-300 text-xl font-medium font-roboto text-dark-hard "
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
              />
            </div>
            <div className="d-form-control w-full ">
              <label className="d-label " htmlFor="caption">
                <span className="d-label-text">Caption:</span>
              </label>
              <input
                id="caption"
                className="d-input d-input-bordered border-slate-300 !outline-slate-300 text-xl font-medium font-roboto text-dark-hard "
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Caption"
              />
            </div>
            <div className="d-form-control w-full ">
              <label className="d-label " htmlFor="slug">
                <span className="d-label-text">Slug:</span>
              </label>
              <input
                id="slug"
                className="d-input d-input-bordered border-slate-300 !outline-slate-300 text-xl font-medium font-roboto text-dark-hard "
                value={postSlug}
                onChange={(e) =>
                  setPostSlug(
                    e.target.value.replace(/\s+/g, "-").toLocaleLowerCase()
                  )
                }
                placeholder="Post Slug"
              />
            </div>
            <div className="mb-5 mt-2">
              <label className="d-label ">
                <span className="d-label-text">Categories:</span>
              </label>
              {isPostDataLoaded && (
                <MultiSelectTagDropdown
                  loadOptions={promiseOptions}
                  onChange={(newValue) =>
                    setCategories(newValue.map((item) => item.value))
                  }
                  defaultValue={data.categories.map(categoryToOption)}
                />
              )}
            </div>
            <div className="mb-5 mt-2">
              <label className="d-label ">
                <span className="d-label-text">Tags:</span>
              </label>
              {isPostDataLoaded && (
                <Creatableselect
                  className="relative z-20"
                  defaultValue={data.tags.map((tag) => ({
                    value: tag,
                    label: tag,
                  }))}
                  isMulti
                  onChange={(newValue) =>
                    setTags(newValue.map((item) => item.value))
                  }
                />
              )}
            </div>
            <div className="w-full">
              {isPostDataLoaded && (
                <Editor
                  content={data?.body}
                  editable={true}
                  onDataChange={(data) => setBody(data)}
                />
              )}
            </div>
            <button
              disabled={isLoadingUpdatePostDetail}
              type="button"
              onClick={handleUpdatePost}
              className="w-full
                 bg-green-500 text-white font-semibold rounded-lg px-4 py-2 
                 disabled:cursor-not-allowed disabled:opacity-70"
            >
              Update Post
            </button>
          </article>
        </section>
      )}
    </div>
  );
};

export default EditPost;
