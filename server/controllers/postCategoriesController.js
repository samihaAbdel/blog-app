import Post from "../models/Post";
import PostCategories from "../models/PostCategories";

export const createPostCategory = async (req, res, next) => {
  try {
    const { title } = req.body;
    const postCateg = await PostCategories.findOne({ title });
    if (postCateg) {
      const error = new Error("Category is already created!!");
      return next(error);
    }
    const newPostCategory = new PostCategories({ title });
    const savedPostCategory = await newPostCategory.save();
    return res.status(201).json(savedPostCategory);
  } catch (error) {
    next(error);
  }
};
export const getAllPostCategories = async (req, res, next) => {
  try {
    const postCategories = await PostCategories.find();

    return res.status(201).json(postCategories);
  } catch (error) {
    next(error);
  }
};
export const updatePostCategories = async (req, res, next) => {
  try {
    const { title } = req.body;
    const postcateg = await PostCategories.findByIdAndUpdate(
      req.params.id,
      { title },
      { new: true }
    );
    if (!postcateg) {
      const error = new Error("Category was not found");
      return next(error);
    }
    return res.status(201).json(postcateg);
  } catch (error) {
    next(error);
  }
};

export const deletePostCategory = async (req, res, next) => {
  try {
    const categoryId = req.params.id;

    await Post.updateMany(
      { categories: { $in: [categoryId] } },
      { $pull: { categories: categoryId } }
    );

    await PostCategories.deleteOne({ _id: categoryId });

    res.send({
      message: "Post category is successfully deleted!",
    });
  } catch (error) {
    next(error);
  }
};
