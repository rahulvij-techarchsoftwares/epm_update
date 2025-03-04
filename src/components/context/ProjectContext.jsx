import React, { createContext, useContext, useState, useEffect } from "react";
import { API_URL } from "../utils/ApiConfig";

const ProjectContext = createContext();

export const ProjectProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [projects, setProjects] = useState([]);
  const token = localStorage.getItem("userToken");
  const userId = localStorage.getItem("user_id");
  console.log(token);

  const addProject = async (clientId, projectName, requirements, budget, deadline) => {
    setIsLoading(true);
    setMessage("");
  
    const requestBody = {
      sales_team_id: parseInt(userId),
      client_id: parseInt(clientId),
      project_name: projectName,
      requirements: requirements,
      budget: parseInt(budget),
      deadline: deadline,
    };
  
    console.log("API URL:", `${API_URL}/api/projects`);
    console.log("Request Payload:", requestBody);
  
    try {
      const response = await fetch(`${API_URL}/api/projects`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });
  
      const text = await response.text(); // Get raw response text
      console.log("Raw API Response:", text);
  
      const data = JSON.parse(text); // Try parsing it as JSON
  
      if (response.ok) {
        setMessage("Project added successfully!");
        fetchProjects();
      } else {
        setMessage(data.message || "Failed to add project.");
      }
    } catch (error) {
      console.error("API Error:", error);
      setMessage("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/projects`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
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

  const editProject = async (id, updatedData) => {
    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch(`${API_URL}/api/projects/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Project updated successfully!");
        fetchProjects();
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage("An error occurred while updating the project.");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteProject = async (id) => {
    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch(`${API_URL}/api/projects/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setMessage("Project deleted successfully!");
        setProjects((prevProjects) => prevProjects.filter((project) => project.id !== id));
      } else {
        setMessage("Failed to delete project.");
      }
    } catch (error) {
      setMessage("An error occurred while deleting the project.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <ProjectContext.Provider value={{ addProject, fetchProjects, editProject, deleteProject, projects, isLoading, message }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => useContext(ProjectContext);
