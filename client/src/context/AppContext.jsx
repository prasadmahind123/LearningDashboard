
import React, { useState, useContext, createContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const navigate = useNavigate();

  // ------------------ GLOBAL STATE ------------------
  const [showUserLogin, setShowUserLogin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null); // "teacher" | "learner" | "admin"
  const [teachers, setTeachers] = useState([]); // admin: all teachers
  const [teacher, setTeacher] = useState(null); // logged-in teacher
  const [learners, setLearners] = useState([]); // admin: all learners
  const [learner, setLearner] = useState(null); // logged-in learner
  const [paths, setPaths] = useState([]); // all learning paths (for everyone)
  const [teachersPath, setTeachersPath] = useState([]); // paths created by logged-in teacher
  const [enrolledStudents , setEnrolledStudents] = useState([])

  // ------------------ API CALLS ------------------
  const fetchAdmin = async () => {
    try {
      // fetch teachers & learners for admin
      const allTeachers = await axios.get("/api/admin/teachers");
      const allLearners = await axios.get("/api/admin/learners");
      setTeachers(allTeachers.data.teachers || []);
      setLearners(allLearners.data.learners || []);
    } catch (error) {
      console.error("Error fetching admin data:", error);
      setTeachers([]);
      setLearners([]);
    }
  };

  const fetchLearningPaths = async () => {
    try {
      const { data } = await axios.get("/api/learningpaths/allpaths");
      if (data.success && Array.isArray(data.paths)) {
        setPaths(data.paths);
      } else {
        setPaths([]);
      }
    } catch (error) {
      console.error("Error fetching learning paths:", error);
      setPaths([]);
    }
  };

  const fetchTeacherPaths = async () => {
    try {
      const { data } = await axios.get("/api/learningpaths/my-paths");
      if (data.success && Array.isArray(data.learningPaths)) {
        setTeachersPath(data.learningPaths);
      } else {
        setTeachersPath([]);
      }
    } catch (error) {
      console.error("Error fetching teacher paths:", error);
      setTeachersPath([]);
    }
  };

  const fetchAllLearners = async () =>{
    try {
      const {data} = await axios.get('/api/learner/getAllLearners')
      if(data.success && Array.isArray(data.learners)){
        setLearners(data.learners);
      }else{
        setLearners([]);
      }
    } catch (error) {
      console.error("Error fetching Learners :", error);
    }
  } 
   const fetchAllTeachers = async () =>{
    try {
      const {data} = await axios.get('/api/teacher/getAllTeachers')
      if(data.success && Array.isArray(data.teachers)){
        setTeachers(data.teachers);
      }else{
        setTeachers([]);
      }
    } catch (error) {
      console.error("Error fetching Teachers :", error);
    }
  }
  useEffect(()=>{
    fetchAllLearners();
    fetchAllTeachers();
  },[])

  const fetchEnrolledLearners = async () =>{
    try {
      const { data } = await axios.get("/api/teacher/enrolled-students");
      if (data.success) {
        setEnrolledStudents(data.students);
      }else{
        setEnrolledStudents([]);
      }
    } catch (error) {
      console.error("Error fetching students:", error);
      setEnrolledStudents([]);
    }
  }



  // ------------------ MAIN AUTH CHECK ------------------
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // 1️⃣ Teacher
        try {
          const t = await axios.get("/api/teacher/is-auth");
          if (t.data.success) {
            setIsAuthenticated(true);
            setUserRole("teacher");
            setTeacher(t.data.teacher);
            await fetchTeacherPaths();
            return;
          }
        } catch (e) {
          if (e.response?.status !== 401) throw e;
        }

        // 2️⃣ Learner
        try {
          const l = await axios.get("/api/learner/is-auth");
          if (l.data.success) {
            setIsAuthenticated(true);
            setUserRole("learner");
            setLearner(l.data.learner);
             try {
                await axios.post(
                  "/api/learner/update-last-access",
                  {}, // no pathId needed here
                  { withCredentials: true }
                );
              } catch (updateError) {
                console.warn("⚠️ Could not update last access:", updateError.message);
              }

            return;
          }
        } catch (e) {
          if (e.response?.status !== 401) throw e;
        }

        // 3️⃣ Admin
        try {
          const a = await axios.get("/api/admin/is-auth");
          if (a.data.success) {
            setIsAuthenticated(true);
            setUserRole("admin");
            await fetchAdmin();
            return;
          }
        } catch (e) {
          if (e.response?.status !== 401) throw e;
        }

        
        setIsAuthenticated(false);
        setUserRole(null);
        setTeacher(null);
        setLearner(null);
      } catch (error) {
        console.error("Error checking authentication:", error);
        setIsAuthenticated(false);
        setUserRole(null);
        setTeacher(null);
        setLearner(null);
      }
    };

    checkAuthStatus();
    fetchLearningPaths(); // fetch public learning paths regardless of role
  }, []);

  // When teacher logs in/out, update teacher paths
  useEffect(() => {
    if (userRole === "teacher" && teacher?._id) {
      fetchTeacherPaths();
      fetchEnrolledLearners();
    }
  }, [userRole, teacher]);

  // When admin logs in, fetch teacher/learner lists
  useEffect(() => {
    if (userRole === "admin") {
      fetchAdmin();
    }
  }, [userRole]);

  // useEffect(()=>{
  //   fetchAllLearners();
  // })

  // ------------------ CONTEXT VALUE ------------------
  const value = {
    showUserLogin,
    setShowUserLogin,
    navigate,
    isAuthenticated,
    setIsAuthenticated,
    userRole,
    setUserRole,
    axios,
    teachers,
    setTeachers,
    teacher,
    setTeacher,
    learners,
    setLearners,
    learner,
    setLearner,
    paths,
    setPaths,
    teachersPath,
    setTeachersPath,
    enrolledStudents,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Custom hook
export const useAppContext = () => useContext(AppContext);

