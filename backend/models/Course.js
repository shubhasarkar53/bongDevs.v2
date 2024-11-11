const mongoose = require('mongoose');

// Sub-schema for Course Sections/Chapters
const sectionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    lessons: [
        {
            title: { type: String, required: true },
            videoUrl: { type: String, required: true }, // URL for each lesson video
            duration: Number, // Duration of the lesson in minutes
            isFreePreview: { type: Boolean, default: false } // Allows free preview of this lesson
        }
    ]
});

// Main Course Schema
const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    description: {
        type: String,
        required: true,
        maxlength: 1000
    },
    imageUrl: String,
    videoUrl: String, // Promo or introductory video URL
    regularPrice: {
        type: Number,
        required: true,
        min: 0
    },
    currentPrice: {
        type: Number,
        min: 0
    },
    category: {
        type: String,
        required: true,
        index: true // Indexed for faster category-based search
    },
    tags: {
        type: [String],
        index: true // Indexed for text search
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    avgRating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0
    },
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Review'
        }
    ],
    enrollmentCount: {
        type: Number,
        default: 0 // Tracks the number of users enrolled
    },
    language: {
        type: String,
        default: 'English' // Default language
    },
    prerequisites: [String], // Any prerequisite skills or knowledge
    sections: [sectionSchema], // Array of sections/chapters for structured content
    isPublished: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Adding index to support full-text search on title and tags
courseSchema.index({ title: 'text', tags: 'text', category: 1 });

// Calculate average rating before saving
courseSchema.methods.calculateAvgRating = function () {
    if (this.reviews.length === 0) {
        this.avgRating = 0;
        return;
    }
    const totalRating = this.reviews.reduce((sum, reviewId) => {
        const review = mongoose.model('Review').findById(reviewId);
        return sum + (review ? review.rating : 0);
    }, 0);
    this.avgRating = totalRating / this.reviews.length;
};

// Middleware to calculate enrollment count on every save
courseSchema.pre('save', async function (next) {
    const enrollments = await mongoose.model('User').countDocuments({ purchasedCourses: this._id });
    this.enrollmentCount = enrollments;
    next();
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
