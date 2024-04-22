import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Modal from 'react-modal';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [registrationMessage, setRegistrationMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (isModalOpen) {
      const timer = setTimeout(() => {
        setIsModalOpen(false); // Close the modal
        router.push('/login'); // Redirect to login page
      }, 3000); // Adjust the delay as needed (3000ms = 3 seconds)
      
      return () => clearTimeout(timer);
    }
  }, [isModalOpen, router]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords don't match!");
      return;
    }

    try {
      const response = await fetch('http://localhost:3004/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, username, password }),
      });
      const data = await response.json();
      if (response.ok) {
        // Registration successful, store user ID in local storage
        localStorage.setItem('userID', data.user.id);
        setRegistrationMessage('User successfully registered');
        setIsModalOpen(true); // Open the modal
      } else {
        setRegistrationMessage(data.error || 'Registration failed');
      }
    } catch (error) {
      console.error('Error registering user:', error);
      setRegistrationMessage('Error registering user');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-cyan-500 to-blue-500">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-lg px-8 py-8 md:w-96"
      >
        <h2 className="text-2xl font-bold mb-8 text-center text-gray-800">Register</h2>
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700" htmlFor="email">
            Email
          </label>
          <input
            className="form-input mt-1 block w-full rounded border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        {/* Username input */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700" htmlFor="username">
            Username
          </label>
          <input
            className="form-input mt-1 block w-full rounded border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        {/* Password input */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700" htmlFor="password">
            Password
          </label>
          <input
            className="form-input mt-1 block w-full rounded border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {/* Confirm Password input */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700" htmlFor="confirm-password">
            Confirm Password
          </label>
          <input
            className="form-input mt-1 block w-full rounded border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
            id="confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        {/* Registration message */}
        {registrationMessage && <p className="text-green-600 text-sm mb-4">{registrationMessage}</p>}
        {/* Register button */}
        <div className="flex items-center justify-center">
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:ring focus:ring-blue-500 focus:ring-opacity-50 transition duration-300"
            type="submit"
          >
            Register
          </button>
        </div>
      </form>
      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        className="modal"
        overlayClassName="overlay"
        contentLabel="Registration Successful"
        ariaHideApp={false}
      >
        <div className="modal-content">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">User successfully registered!</h2>
        </div>
      </Modal>
    </div>
  );
}

export default Register;
