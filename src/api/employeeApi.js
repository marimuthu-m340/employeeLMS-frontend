import axios from "axios";
import { API_BASE_URL } from "../apiConfig";

const API_URL = `${API_BASE_URL}/api/employees`;

// =====================================================
// GET ALL EMPLOYEES
// =====================================================

export const getEmployees = async () => {

  try {

    const response =
      await axios.get(API_URL);

    return response.data;

  } catch (error) {

    console.error(
      "GET EMPLOYEES API ERROR:",
      error.response?.data ||
      error.message
    );

    throw error;

  }

};


// =====================================================
// GET ALL DEPARTMENTS
// =====================================================

export const getDepartments = async () => {

  try {

    const response =
      await axios.get(
        API_URL + "/departments"
      );

    return response.data;

  } catch (error) {

    console.error(
      "GET DEPARTMENTS API ERROR:",
      error.response?.data ||
      error.message
    );

    throw error;

  }

};


// =====================================================
// CREATE EMPLOYEE
// =====================================================

export const createEmployee = async (
  employeeData
) => {

  try {

    const response =
      await axios.post(
        API_URL,
        employeeData
      );

    return response.data;

  } catch (error) {

    console.error(
      "CREATE EMPLOYEE API ERROR:",
      error.response?.data ||
      error.message
    );

    throw error;

  }

};


// =====================================================
// UPDATE EMPLOYEE
// =====================================================

export const updateEmployee = async (
  employeeId,
  employeeData
) => {

  try {

    const response =
      await axios.put(
        API_URL + "/" + employeeId,
        employeeData
      );

    return response.data;

  } catch (error) {

    console.error(
      "UPDATE EMPLOYEE API ERROR:",
      error.response?.data ||
      error.message
    );

    throw error;

  }

};


// =====================================================
// DELETE EMPLOYEE
// =====================================================

export const deleteEmployee = async (
  employeeId
) => {

  try {

    const response =
      await axios.delete(
        API_URL + "/" + employeeId
      );

    return response.data;

  } catch (error) {

    console.error(
      "DELETE EMPLOYEE API ERROR:",
      error.response?.data ||
      error.message
    );

    throw error;

  }

};
export const getMyProfile = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.get(API_URL + "/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error(
      "GET MY PROFILE API ERROR:",
      error.response?.data || error.message
    );
    throw error;
  }
};