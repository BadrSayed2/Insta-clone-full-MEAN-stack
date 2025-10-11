
const login = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return next(new ApiError("in-valid login Data", 400));
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    return next(new ApiError("in-valid login Data", 400));
  }

  const code = generateCode();
  await OTP.create({ userId: user._id, code });

  emailEvent.emit("sendConfirmEmail", { email, code });

  if (!user.isVerified) {
    return next(new ApiError("in-valid login Data", 400));
  }

  const token = generateOTPToken(String(user._id));
  const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "Strict",
    maxAge: 5 * 60 * 1000,
  };

  res.cookie("OTP_verification_token", token, cookieOptions);
  return res
    .status(200)
    .json(
      new ApiResponse({ message: "please check your email", success: true })
    );
};

const forgetPassword = async (req, res, next) => {
  const email = req.body.email;
  const user = await User.findOne({ email });
  if (!user)
    return next(
      new ApiError("if Email exists activation link will be sent", 404)
    );
  const resetToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  user.passwordResetToken = hashedToken;
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  await user.save();
  const resetUrl = `${process.env.API_BASE_URL}/reset-password?token=${resetToken}`;
  logger.info(`Password reset URL: ${resetUrl}`);
  //send email
  emailEvent.emit("sendResetPasswordEmail", { email, resetUrl });
  res.status(200).json(
    new ApiResponse({
      message: "if Email exists activation link will be sent",
      url: resetUrl,
    })
  );
};

const resetPassword = async (req, res, next) => {
  const { token } = req.query;
  const { newPassword } = req.body;
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) {
    return next(new ApiError("Link is invalid or has expired", 400));
  }

  user.password = await bcrypt.hash(newPassword, parseInt(process.env.SALT));
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  res
    .status(200)
    .json(new ApiResponse({ message: "Password reset successful" }));
};
const verifyOtp = async (req, res, next) => {
  console.log("a7a");
  const token = req?.cookies?.["OTP_verification_token"]; // contains user id
  const code = String(req?.body?.code ?? "").trim();

  if (!token) {
    return next(new ApiError("you need to login", 401));
  }
  if (!code || code.length !== 8) {
    return next(new ApiError("Invalid or missing OTP code", 400));
  }

  const payload = verifyOTPToken(token);

  const user = await User.findById(payload.userId);
  if (!user) {
    return next(new ApiError("you need to login", 401));
  }

  const otpDoc = await OTP.findOne({ userId: user._id, code });

  if (otpDoc) {
    if (!user?.isVerified) {
      user.isVerified = true;
      await user.save();

    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create username from first and last name
    const baseUsername = `${firstName.toLowerCase()}.${lastName.toLowerCase()}`;
    let userName = baseUsername;
    //generate random number base 6
    const randomNumber = Math.floor(Math.random() * 1000000);
    // Add random number to username
    userName = `${baseUsername}.${randomNumber}`;

    // Ensure unique username
    while (await User.findOne({ userName })) {
      userName = `${baseUsername}.${randomNumber}`;
      const randomNumber = Math.floor(Math.random() * 1000000);
      // Add random number to username
      userName = `${baseUsername}.${randomNumber}`;
    }

    // Generate OTP code
    const otpCode = generateCode();

    // Create user
    const newUser = new User({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      fullName: `${firstName.trim()} ${lastName.trim()}`,
      userName,
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      phoneNumber,
      gender: gender.toLowerCase(),
      date_of_birth: new Date(DOB),
      otpCode,
      otpExpires: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes from now
    });

    await newUser.save();

    // Generate OTP token for verification
    const otpToken = generateOTPToken(newUser._id);

    // Send OTP email
    emailEvent.emit("sendConfirmEmail", {
      email: newUser.email,
      code: otpCode
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully. Please verify your email with the OTP sent.",
      data: {
        userId: newUser._id,
        email: newUser.email,
        otpToken, // In production, don't send this - it's just for testing
      }
    });

  } catch (error) {
    console.error("Signup error:", error);
    return next(new ApiError("Registration failed", 500));
  }
};
