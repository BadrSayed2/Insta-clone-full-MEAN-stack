const mongoose = (require('../config/db_config')).mongoose;

const followers_schema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  followed: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
}, { timestamps: true });

followers_schema.index({ user: 1, followed: 1 });

const Follower = mongoose.model('Follower', followers_schema);

module.exports = Follower;
