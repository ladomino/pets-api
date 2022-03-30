const mongoose = require('mongoose')

const {Schema, model} = mongoose

const petSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
		},
        type: {
			type: String,
			required: true,
		},
        age: {
			type: Number,
			required: true,
		},
		adoptable: {
			type: Boolean,
			required: true,
		},
		owner: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
	},
	{
		timestamps: true,
        // these lines ensure the virtual will be included.
        //  whenever we turn our document to an object or JSON
        toObject: { virtuals: true},
        toJSON: { virtuals: true}
	}
)

// We will build our virtuals later whatever that means.
petSchema.virtual('fullTitle').get(function() {

    // we can do whatever javascript thing we want 
    //   we just need to make sure we return some value
    return(`${this.name} the ${this.type}`)

})

petSchema.virtual('isABaby').get(function() {
    if (this.age < 5) {
        return 'yeah they are just a baby'
    } else if (this.age >= 5 && this.age < 10) {
        return 'not really a baby but still a baby'
    } else {
        return 'not a baby'
    }
})

module.exports = mongoose.model('Pet', petSchema)
