export const pickRecommendedCourses = ({ completedCourseIds, enrolledCourseIds, currentField, allCourses }) => {
  return allCourses
    .filter((course) => !completedCourseIds.includes(course.Course_ID))
    .filter((course) => !enrolledCourseIds.includes(course.Course_ID))
    .sort((a, b) => {
      const aScore = Number(a.Field_Name === currentField) + Number(a.avgRating || 0) / 5;
      const bScore = Number(b.Field_Name === currentField) + Number(b.avgRating || 0) / 5;
      return bScore - aScore;
    })
    .slice(0, 5);
};
