//GET method to get all the posts
exports.getAllPosts = (req, res) => {
  try {
  } catch (err) {
    res
      .status(500)
      .json({ err: "Something has went wrong. Please try again later." });
  }
};

//GET method to return post with given id
exports.getSinglePost = (req, res) => {
  try {
  } catch (err) {
    res
      .status(500)
      .json({ err: "Something has went wrong. Please try again later." });
  }
};

//GET method to return all posts from a category with given id
exports.getCategoryPosts = (req, res) => {
  try {
  } catch (err) {
    res
      .status(500)
      .json({ err: "Something has went wrong. Please try again later." });
  }
};

//POST method to create a post
exports.createPost = (req, res) => {
  try {
  } catch (err) {
    res
      .status(500)
      .json({ err: "Something has went wrong. Please try again later." });
  }
};

//PUT method to update a post with given id
exports.updatePost = (req, res) => {
  try {
  } catch (err) {
    res
      .status(500)
      .json({ err: "Something has went wrong. Please try again later." });
  }
};

//DELETE method to delete a post with given id
exports.deletePost = (req, res) => {
  try {
  } catch (err) {
    res
      .status(500)
      .json({ err: "Something has went wrong. Please try again later." });
  }
};
