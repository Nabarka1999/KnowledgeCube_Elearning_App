import React, { useState } from "react";
import "./courses.css";
import { CourseData } from "../../context/CourseContext";
import CourseCard from "../../components/coursecard/CourseCard";
import { IoIosSearch } from "react-icons/io";

const Courses = () => {
  const { courses } = CourseData(); 
  const [searchTerm, setSearchTerm] = useState("");


  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    course.author.toLowerCase().includes(searchTerm.toLowerCase()) || 
    course.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="courses">
      <input className="serach_bar"
        type="search"
        placeholder="Enter course name to search "
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        /> <IoIosSearch className="search_icon"/>
      <h2>Available Courses</h2>
      <div className="course-container">
        
        {filteredCourses && filteredCourses.length > 0 ? (
          filteredCourses.map((e) => <CourseCard key={e._id} course={e} />)
        ) : (
          <p>No courses found.</p> 
        )}
      </div>
    </div>
  );
};

export default Courses;
