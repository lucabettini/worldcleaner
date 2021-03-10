import mongoose from 'mongoose';

const placeSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    name: {
      type: String,
      required: true,
    },
    description: String,
    imgUrl: {
      type: String,
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
    cleaned: {
      isCleaned: {
        type: Boolean,
        default: false,
      },
      imgUrl: String,
      description: String,
      timestamp: Date,
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    },
  },
  {
    timestamps: true,
  }
);

const Place = mongoose.model('Place', placeSchema);

export default Place;
