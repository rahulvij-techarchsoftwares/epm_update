import React, { createContext, useContext, useState, useEffect } from "react";
import { API_URL } from "../utils/ApiConfig";

const ClientContext = createContext();

export const ClientProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [clients, setClients] = useState([]);
  const token = localStorage.getItem("userToken");
    console.log(token);

  const addClient = async (name, upworkId, contactDetail) => {
    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch(`${API_URL}/api/clients`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, 
        },
        body: JSON.stringify({
          name,
          upwork_id: upworkId,
          contact_detail: contactDetail,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Client added successfully!");
        fetchClients(); 
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };


  const fetchClients = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/clients`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setClients(data);
        console.log(clients);
      } else {
        setMessage("Failed to fetch clients.");
      }
    } catch (error) {
      setMessage("An error occurred while fetching clients.");
    } finally {
      setIsLoading(false);
    }
  };

  const editClient = async (id, updatedName, updatedUpworkId, updatedContactDetail) => {
    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch(`${API_URL}/api/clients/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: updatedName,
          upwork_id: updatedUpworkId,
          contact_detail: updatedContactDetail,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Client updated successfully!");
        fetchClients(); 
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage("An error occurred while updating the client.");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteClient = async (id) => {
    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch(`${API_URL}/api/clients/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setMessage("Client deleted successfully!");
        setClients((prevClients) => Array.isArray(prevClients) ? prevClients.filter((client) => client.id !== id) : []);
        fetchClients();
      } else {
        setMessage("Failed to delete client.");
      }
    } catch (error) {
      setMessage("An error occurred while deleting the client.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  return (
    <ClientContext.Provider value={{ addClient, fetchClients, editClient, deleteClient, clients, isLoading, message }}>
      {children}
    </ClientContext.Provider>
  );
};

export const useClient = () => useContext(ClientContext);
