import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
  // get user data from frontend
  // validation - not empty
  // check if user already exists: username and email check
  // check for images and avatar
  // upload to cloudinary
  // create user object - create entry in db
  // remove password and refresh token field from response
  // check for user creation
  // return response or error

  const { fullName, email, userName, password } = req.body;

  console.log(req.body);

  console.log("email: ", email);

  if (
    [fullName, email, userName, password].some((feild) => feild?.trim() === "")
  ) {
    throw new ApiError(400, "All feilds are required");
  }

  const exsitedUser = await User.findOne({
    $or: [{ userName }, { email }],
  });
  if (exsitedUser) {
    throw new ApiError(409, "User already exsited");
  }
  const avatarLocalPath = req.files?.avatar[0]?.path;
  console.log(req.files?.avatar[0]);
  // const coverImageLocalPath = req.files?.coverImage[0]?.path;
  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar is required");
  }
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(400, "Avatar is required");
  }

  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    userName: userName.toLowerCase(),
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registring the user");
  }
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registed successfully"));
});

export { registerUser };
