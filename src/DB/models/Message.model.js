import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  // field
  {
    attachments : [{secure_url: String,public_id: String}],
    content: {
      type: String,
      required: function(){
        return this.attachments?.length < 1 ? true : false
      },
      minLength: [2, "min length 2 character"],
      maxLength: [500, "min length 2 character"],
    },
    receivedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    deletedAt: Date,
    deletedBy: {type:mongoose.Schema.Types.ObjectId , ref:"User"},
  },
  // option
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const MessageModel = mongoose.models.Message || mongoose.model("Message", messageSchema);
export default MessageModel;
MessageModel.syncIndexes();
