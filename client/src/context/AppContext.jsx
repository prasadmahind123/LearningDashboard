// import React ,{useState , useContext , createContext , useEffect} from 'react'
// import { useNavigate } from 'react-router-dom';
// import axios from "axios";

// axios.defaults.withCredentials = true;
// axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

// export const AppContext = createContext();
// export const AppProvider = ({children}) => {
//     const navigate = useNavigate();

//     const [showUserLogin, setShowUserLogin] = useState(false);
//     const [isAuthenticated, setIsAuthenticated] = useState(false);
//     const [userRole, setUserRole] = useState(null); // "teacher" or "learner"
//     const [teachers, setTeachers] = useState([]);  // for admin to view all teachers
//     const [teacher , setTeacher] = useState(null);  // fro teacher to view their own profile
//     const [learners, setLearners] = useState([]); // for admin: all learners
//     const [learner, setLearner] = useState(null); // for learner: current logged-in learner
//     const [paths , setPaths] = useState([]); // for admin: all paths
//     const [teachersPath , setTeachersPath] = useState([]); //paths created by teacher


// //   const fetchTeacher = async () => {
// //   try {
// //     const response = await axios.get('/api/teacher/is-auth', { withCredentials: true });

// //     if (response.data.success) {
// //       setIsAuthenticated(true);
// //       setUserRole('teacher');

// //     } else {
// //       // not approved or not authenticated
// //       setIsAuthenticated(false);
// //       setUserRole(null);
// //       setTeacher(null);
// //       alert("Not approved") // or show alert/modal
// //     }
// //   } catch (error) {
// //     console.error('Error fetching teacher profile:', error);
// //     setIsAuthenticated(false);
// //     setUserRole(null);
// //   }
// // }


// const fetchAdmin = async () => {
//   try {
//     const response = await axios.get('/api/admin/is-auth', { withCredentials: true });
//     if (response.data.success) {
//       setIsAuthenticated(true);
//       setUserRole('admin');

//       // 👉 Fetch all teachers for admin
//       const allTeachers = await axios.get("/api/admin/teachers", {
//         withCredentials: true,
//       });
//       setTeachers(allTeachers.data.teachers);

//     // 👉 Fetch all learners for admin
//     const allLearners = await axios.get("/api/admin/learners", {
//       withCredentials: true,
//     })
//     setLearners(allLearners.data.learners);
//     } else {
//       setIsAuthenticated(false);
//       setUserRole(null);
//     }
//   } catch (error) {
//     console.error('Error fetching admin profile:', error);
//     setIsAuthenticated(false);
//     setUserRole(null);
//   }
// }

// const fetchLearningPaths = async () => {
//   try {
//     const { data } = await axios.get('/api/learningpaths/allpaths', {
//       withCredentials: true,
//     });

//     console.log(data)

//     if (data.success && Array.isArray(data.paths)) {
//       setPaths(data.paths); 
//     } else {
//       setPaths([]);
//     }
//   } catch (error) {
//     console.error('Error fetching learning paths:', error);
//     setPaths([]);
//   }
// };

//  const fetchTeacher = async () => {
//     try {
//       const response = await axios.get('/api/teacher/is-Auth', { withCredentials: true });
//       if (response.data.success) {
//         setIsAuthenticated(true);
//         setUserRole('teacher');
//         setTeacher(response.data.teacher); // Save logged-in teacher data
//       } else {
//         setIsAuthenticated(false);
//         setUserRole(null);
//         setTeacher(null);
//       }
//     } catch (error) {
//       console.error('Error fetching teacher profile:', error);
//       setIsAuthenticated(false);
//       setUserRole(null);
//       setTeacher(null);
//     }
//   };
  
//   const fetchLerner = async () => {
//     try {
//       const response = await axios.get('/api/learner/is-auth', { withCredentials: true });
//       if (response.data.success) {
//         setIsAuthenticated(true);
//         setUserRole('learner');
//         setLearner(response.data.learner);
//       } else {
//         setIsAuthenticated(false);
//         setUserRole(null);
//         setLearner(null);
//       }
//     } catch (error) {
//       console.error('Error fetching learner profile:', error);
//       setIsAuthenticated(false);
//       setUserRole(null);
//       setLearner(null);
//     }
//   }


// useEffect(() => {
//   fetchTeacher();
// }, []);

// useEffect(() => {
//   fetchLerner();
// }, []);


// const fetchTeacherPaths = async () => {
//   try {
//     const { data } = await axios.get("/api/learningpaths/my-paths", {
//       withCredentials: true,
//     });

//     if (data.success) {
//       setTeachersPath(data.learningPaths || []); // ✅ always an array
//     }
//   } catch (error) {
//     console.error("Error fetching teacher paths:", error);
//     setTeachersPath([]);
//   }
// };




// // const fetchEnrolledLearners = async () => {
// //   try {
// //     const res = await axios.get("/api/teacher/enrolled-students", {
// //           withCredentials: true
// //         });
// //         setPaths(res.data);
// //   }catch(error){
// //     console.error('Error fetching enrolled learners:', error);
// //   }
// // }

//         useEffect(() => {
//             if (teacher?._id) {
//               console.log("teacher id from context", teacher._id);
//               fetchTeacherPaths();
//             }
//         }, [teacher]);  
//         useEffect (() => {
//           fetchLearningPaths();
//         },[]);

//     // useEffect(() => {
//     //     const checkAuthStatus = async () => {
//     //         // Check if user is already authenticated
//     //         try {
//     //             // Try to check teacher authentication
//     //             const teacherResponse = await axios.get('/api/teacher/is-Auth', { withCredentials: true });
//     //             if (teacherResponse.data.success) {
//     //                 setIsAuthenticated(true);
//     //                 setUserRole('teacher');
//     //                 setTeacher(teacherResponse.data.teacher);
//     //                 await fetchTeacherPaths();
//     //                 return;
//     //             }
                
//     //             // Try to check learner authentication
//     //             const learnerResponse = await axios.get('/api/learner/is-auth', { withCredentials: true });
//     //             if (learnerResponse.data.success) {
//     //                 setIsAuthenticated(true);
//     //                 setUserRole('learner');
//     //                 setLearner(learnerResponse.data.learner);
//     //                 return;
//     //             }
                
//     //             // Try to check admin authentication
//     //             const adminResponse = await axios.get('/api/admin/is-auth', { withCredentials: true });
//     //             if (adminResponse.data.success) {
//     //                 setIsAuthenticated(true);
//     //                 setUserRole('admin');
//     //                 await fetchAdmin();
//     //                 return;
//     //             }
                
//     //             // No authentication found
//     //             setIsAuthenticated(false);
//     //             setUserRole(null);
//     //             setLearner(null);
                
//     //         } catch (error) {
//     //             console.error('Error checking authentication:', error);
//     //             setIsAuthenticated(false);
//     //             setUserRole(null);
//     //             setLearner(null);
//     //         }
//     //     };

//     //     checkAuthStatus();
//     // }, []);

//     useEffect(() => {
//         const checkUserRole = async () => {

//             if (userRole === 'teacher') {
//                 await fetchTeacherPaths();
//             } else if (userRole === 'admin') {
//                 await fetchAdmin();
//             }
//         };

//         if (userRole) {
//             checkUserRole();
//         }
//     }, [userRole]);
        

//     useEffect(()=>{
//       // fetchEnrolledLearners();
//     },[userRole])



 

//   const value = {
//     showUserLogin,
//     setShowUserLogin,
//     navigate,
//     isAuthenticated,
//     setIsAuthenticated,
//     userRole,
//     setUserRole,
//     axios,
//     teachers,
//     setTeachers,
//     teacher,
//     setTeacher,
//     learners,
//     setLearners,
//     learner,
//     setLearner,
//     paths,
//     setPaths,
//     setTeachersPath,
//     teachersPath,
//   }
//     return (
//         <AppContext.Provider value={value}>
//             {children}
//         </AppContext.Provider>
//     )
  
// }

// export const useAppContext = () => {
//     return useContext(AppContext);
// }

import React, { useState, useContext, createContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL; // e.g. http://localhost:5000

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

        // ❌ No valid session
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
    }
  }, [userRole, teacher]);

  // When admin logs in, fetch teacher/learner lists
  useEffect(() => {
    if (userRole === "admin") {
      fetchAdmin();
    }
  }, [userRole]);

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
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Custom hook
export const useAppContext = () => useContext(AppContext);

