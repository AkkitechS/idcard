import { asyncHandler } from "../utils/async_handler.js";
import { ApiError } from "../utils/ApiError.js";
import { validateEmail } from "../utils/validateEmail.js";
import { Admin } from "../models/admin.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { generateID } from "../utils/id_generator.js";


// generate refresh and access token methods
const generateAccessAndRefreshToken = async (adminObjectId) => {
  try {
    const admin = await Admin.findById(adminObjectId);
  const accessToken = admin.generateAccessToken();
  const refreshToken = admin.generateRefreshToken();

  admin.refreshToken = refreshToken;
  await user.save({ validateBeforeSave : false });

  return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating refresh and access token");
  }
};

// Register Admin
const registerAdmin = asyncHandler(async (req, res) => {
  // get admin data from admin
  // validate admin data - not empty
  // check if admin already exist in database : email, username
  // create user object - create entry in db
  // remove password and refreshtoken fields from response
  // check for user creation
  // return response

  let { name, username, email, password, role } = req.body;

  console.log(req.body);

  if (
    [name, username, email, password, role].some(
      (field) => field?.trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }

  if (!validateEmail(email?.trim())) {
    throw new ApiError(400, "Incorrect email");
  }

  const existedAdmin = await Admin.findOne({ $or: [{ username }, { email }] });

  console.log("Existed admin : ", existedAdmin);

  if (existedAdmin) {
    throw new ApiError(409, "You are already registered.");
  }

  const adminId = generateID("ADMSH");

  const admin = await Admin.create({
    adminId : adminId,
    name : name,
    username: username.toLowerCase(),
    email : email,
    password : password,
    role : role
  });

  console.log("Admin : ", admin);

  const createdAdmin = await Admin.findById(admin._id).select("-password -refreshToken");

  console.log("Created admin : ", createdAdmin);
  if(!createdAdmin) {
    throw new ApiError(500, "Internal server error, admin npt registered")
  }

  return res.status(200).json(new ApiResponse(200, createdAdmin, "Admin successfully registered"));

});

// Login Admin
const adminLogin = asyncHandler( async (req, res) => {

  // get credentials req.body -> data
  // login by username
  // find the admin
  // password check
  // generate access and refresh token
  // send cookie

  const { username, password } = req.body;

  if(!username) throw new ApiError(400, "Username is required");

  const admin = await Admin.findOne({ email });

  if(!admin) throw new ApiError(404, "Admin does not exist");

  const isPasswordCorrect = await admin.checkPassword(password);

  if(!isPasswordCorrect) throw new ApiError(401, "Invalid User credentials");

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(admin._id);

  const loggedInAdmin = Admin.findById(admin._id).select("-password -refreshToken");

  const options = {
    httpOnly : true,
    secure : true
  };

  return res.status(200)
  .cookie("accessToken", accessToken, options)
  .cookie("refreshToken", refreshToken, options)
  .json(new ApiResponse(200, { admin : loggedInAdmin, accessToken, refreshToken }, "Admin logged in successfully"));
});

// Logout Admin
const logoutAdmin = asyncHandler( async (req, res) => {
  await Admin.findByIdAndUpdate(req.admin._id, { refreshToken : undefined }, { new : true });

  const options = {
    httpOnly : true,
    secure : true
  };

  return res
  .status(200)
  .clearCookie("accessToken", options)
  .clearCookie("refreshToken", options)
  .json(new ApiResponse(200, "Admin logged out."));
} );

export { registerAdmin, adminLogin, logoutAdmin };
