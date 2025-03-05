import { createContext, useContext, useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import { API_URL } from "../utils/ApiConfig";
const BDProjectsAssignedContext = createContext();

export const BDProjectsAssignedProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [projects, setProjects] = useState([]);
    const [projectManagers, setProjectManagers] = useState([]);
    const token = localStorage.getItem("userToken");
    const userId = localStorage.getItem("user_id");
    console.log(token);
    const navigate = useNavigate();
    const handleUnauthorized = (response) => {
      if (response.status === 401) {
        localStorage.removeItem("userToken");
        navigate("/");
        return true;
      }
      return false;
    };
   

  useEffect(() => {
      const fetchProjects = async () => {
        setIsLoading(true);
        try {
          const response = await fetch(`${API_URL}/api/projects`, {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${token}`,
            },
          });
    
          if (handleUnauthorized(response)) return;
          const data = await response.json();
          if (response.ok) {
            setProjects(data.data || []);
          } else {
            setMessage("Failed to fetch projects.");
          }
        } catch (error) {
          setMessage("An error occurred while fetching projects.");
        } finally {
          setIsLoading(false);
        }
      };

    fetchProjects();
  }, []);


  useEffect(() => {
    const fetchProjectManagers = async () => {
      try {
        const response = await fetch(`${API_URL}/api/projectManager`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        if (handleUnauthorized(response)) return;
        const data = await response.json();
        if (response.ok) {
          setProjectManagers(data.data || []);
        } else {
          setMessage("Failed to fetch project managers.");
        }
      } catch (error) {
        setMessage("An error occurred while fetching project managers.");
      }
    };

    fetchProjectManagers();
  }, []);

  return (
    <BDProjectsAssignedContext.Provider value={{ projects, projectManagers, isLoading }}>
      {children}
    </BDProjectsAssignedContext.Provider>
  );
};

export const useBDProjectsAssigned = () => {
  return useContext(BDProjectsAssignedContext);
};
