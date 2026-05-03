import mongoose from "mongoose";

export let genderEnum = { male: "male", female: "female" };
export let roleEnum = { user: "User", admin: "Admin" };
export let providerEnum = { system: "system", google: "google" };

const userSchema = new mongoose.Schema(
  {
    // fields DB
    firstName: {
      type: String,
      required: true,
      minLength: [
        2,
        "minLength in firstName is 2 char and you have entered {VALUE}",
      ],
      maxLength: [
        20,
        "minLength in firstName is 20 char and you have entered {VALUE}",
      ],
    },
    lastName: {
      type: String,
      required: true,
      minLength: [
        2,
        "minLength in lastName is 2 char and you have entered {VALUE}",
      ],
      maxLength: [
        20,
        "minLength in lastName is 20 char and you have entered {VALUE}",
      ],
    },
    email: {
      type: String,
      required: true,
      unique: true, // helper method
    },
    password: {
      type: String,
      required: function () {
        this.provider === providerEnum.system ? true : false;
      },
    },
    favorites: {
      type: [
        {
          mediaId: String,
          mediaType: {
            type: String,
            enum: ["movie", "tv"],
          },
        },
      ],
      default: [], // 👈 هذا أهم سطر
    },
    gender: {
      type: String,
      enum: {
        values: Object.values(genderEnum),
        message: `gender only allow ${Object.values(genderEnum)}`,
      },
      default: genderEnum.male,
    },
    provider: {
      type: String,
      enum: {
        values: Object.values(providerEnum),
      },
      default: providerEnum.system,
    },
    role: {
      type: String,
      enum: {
        values: Object.values(roleEnum),
        message: `role only allow ${Object.values(roleEnum)}`,
      },
      default: roleEnum.user,
    },
    confirmEmailOtp: {
      type: String,
      required: function () {
        this.provider === providerEnum.system ? true : false;
      },
    },
    OtpCreatedAt: {
      type: Date,
      default: Date.now,
    },
    OTPCount: {
      type: Number,
      default: 0,
      required: function () {
        this.provider === providerEnum.system ? true : false;
      },
    },
    phone: String, // do not forget validation regex
    confirmEmail: Date,
    block: Date,
    deletedAt: Date,
    deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    restoreAt: Date,
    restoreBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    // olePasswordList : {type:[String]},
    forgetPassword: String,
    changeLoginCredentials: Date,
    img: { secure_url: String, public_id: String },
    cover: [{ secure_url: String, public_id: String }],
  },
  {
    // Option
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

userSchema
  .virtual("fullName")
  .set(function (val) {
    const [firstName, lastName] = val?.split(" ") || [];
    this.set({ firstName, lastName });
    return;
  })
  .get(function () {
    return this.firstName + " " + this.lastName;
  });

userSchema.virtual("messages", {
  ref: "Message",
  localField: "_id",
  foreignField: "receivedBy",
});
export const UserModel =
  mongoose.models.User || mongoose.model("User", userSchema);
UserModel.syncIndexes();
