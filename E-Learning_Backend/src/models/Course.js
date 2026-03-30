// export default class Course {
//     constructor(courseId, courseName, courseOverview, courseObjective, courseFee, courseStatus)
//     {
//         this.courseId = courseId
//         this.courseName = courseName
//         this.courseOverview = courseOverview
//         this.courseObjective = courseObjective
//         this.courseFee = courseFee
//         this.courseStatus = courseStatus
//     }
// }

export default class Course {
    constructor({
        courseId,
        courseName,
        courseOverview,
        courseObjective,
        courseFee,
        courseStatus,
        fieldName = null,
        subscriptionId = null
    }) {
        this.courseId = courseId;
        this.courseName = courseName;
        this.courseOverview = courseOverview;
        this.courseObjective = courseObjective;
        this.courseFee = courseFee;
        this.courseStatus = courseStatus;
        this.fieldName = fieldName;
        this.subscriptionId = subscriptionId;
    }
}