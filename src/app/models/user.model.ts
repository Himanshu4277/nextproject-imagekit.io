import mongoose, { model, models, mongo, Schema } from "mongoose"
import bcrypt from "bcryptjs"

export interface Iuser {
    email: string,
    password: string,
    _id?: mongoose.Types.ObjectId,
    createdAt: Date,
    updatedAt: Date
}

const UserSchema = new Schema<Iuser>({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

}, { timestamps: true })

UserSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10)
    }
    next()
})

const User = models?.User || model("User", UserSchema)

export default User