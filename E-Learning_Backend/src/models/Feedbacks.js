class Feedbacks {
    constructor(feedbackId, courseId, learnerId, feedbackComment, feedbackRating, feedbackCreatedAt) {
        this.feedbackId = feedbackId;
        this.courseId = courseId;
        this.learnerId = learnerId;
        this.feedbackComment = feedbackComment;
        this.feedbackRating = feedbackRating;
        this.feedbackCreatedAt = feedbackCreatedAt;
    }
}

export default Feedbacks;