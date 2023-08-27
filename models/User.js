const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  likedMovies: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie',
  }],
  watchlist: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie', 
  }],
});

userSchema.statics.isEmailInUse = async function (email){
    try {
        const found = await this.findOne({email});
        if(found)return true;
        else return false;
    } catch (error) {
        console.error("error inside isEmailInUse", error);
        return false;
    }
}

userSchema.pre('save',function(next){
    if(this.isModified("password")){
        bcrypt.hash(this.password, 8, (err, hash)=>{
            if(err) return err;

            this.password = hash;
            next();
        });
    }
})

userSchema.methods.comparePassword = async function(password){
    if(!password) throw new Error("password must be provided");
    // console.log(this.password, password)
    try {
        const result = await bcrypt.compare(password, this.password);
        // console.log(result);
        return result;
    } catch (error) {
        console.log("error while comparing message", error.message);
    }
}

const User = mongoose.model('User', userSchema);

module.exports = User;
