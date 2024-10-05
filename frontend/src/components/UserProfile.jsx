import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom'

function UserProfile() {
  // State to manage the edit mode and user details
  const navigate = useNavigate()
  const [isEditing, setIsEditing] = useState(false);
  // const [user,setUser] = useState(null);
  const [userDetails, setUserDetails] = useState({
    fullName: 'John Doe',
    email: 'johndoe@example.com',
    phone: '(123) 456-7890',
    address: '123 Main St\nAnytown, USA 12345',
  });

  useEffect(() => {

    const fetchUser = async () => {
      try {
        const response = await axios.get('http://localhost:8002/api/profile/user-info',{withCredentials:true});
        const userData = response.data;
        if(!userData){
          console.log("User not found");
        }
        console.log(userData);
        // setUser(response.data.user);
        setUserDetails({
          fullName: userData.fullName,
          email: userData.email,
          phone: '',
          address: ''
        })
      } catch (error) {
        console.log(error);
      }
    }

    fetchUser();
  },[navigate])

  

  // Function to handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserDetails({
      ...userDetails,
      [name]: value,
    });
  };

  // Toggle edit mode
  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  return (
    <div className="max-w-2xl m-auto my-5">
      <div className="bg-white overflow-hidden shadow rounded-lg border">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Your Profile</h3>
          <button
            className="bg-red-500 hover:bg-red-700  text-white px-3 py-1 rounded"
            onClick={toggleEdit}
          >
            {isEditing ? 'Save' : 'Edit'}
          </button>
        </div>

        <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
          <dl className="sm:divide-y sm:divide-gray-200">
            <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Full name</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {isEditing ? (
                  <input
                    type="text"
                    name="fullName"
                    value={userDetails.fullName}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-2 py-1"
                  />
                ) : (
                  userDetails.fullName
                )}
              </dd>
            </div>

            <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Email address</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={userDetails.email}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-2 py-1"
                  />
                ) : (
                  userDetails.email
                )}
              </dd>
            </div>

            <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Phone number</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {isEditing ? (
                  <input
                    type="text"
                    name="phone"
                    value={userDetails.phone}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-2 py-1"
                  />
                ) : (
                  userDetails.phone
                )}
              </dd>
            </div>

            <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Address</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {isEditing ? (
                  <textarea
                    name="address"
                    value={userDetails.address}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-2 py-1"
                  />
                ) : (
                  userDetails.address.split('\n').map((line, index) => (
                    <span key={index}>
                      {line}
                      <br />
                    </span>
                  ))
                )}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
