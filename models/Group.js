const { model, Schema } = require("mongoose");

const groupSchema = new Schema({
  body: String,
  username: String,
  createdAt: String,
  bio: String,
  avatar: String,
  posts: [
    {
      title: String,
      body: String,
      username: String,
      createdAt: String,
      comments: [
        {
          title: String,
          body: String,
          username: String,
          createdAt: String,
          comments: [
            {
              title: String,
              body: String,
              username: String,
              createdAt: String
            }
          ]
        }
      ],
      likes: [
        {
          username: String,
          createdAt: String
        }
      ],
      reports: [
        {
          username: String,
          createdAt: String
        }
      ],
      top: Boolean,
      qualified: Boolean,
      user: {
        type: Schema.Types.ObjectId,
        ref: "User"
      }
    }
  ],
  likes: [
    {
      username: String,
      createdAt: String
    }
  ],
  admins: [
    {
      username: String,
      createdAt: String
    }
  ],
  creator: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  applies: [
    {
      title: String,
      body: String,
      username: String,
      createdAt: String
    }
  ],
  admissions: [
    {
      body: String,
      username: String,
      createdAt: String
    }
  ]
});

module.exports = model("Group", groupSchema);
